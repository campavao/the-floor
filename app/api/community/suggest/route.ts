import { Output, generateText } from "ai";
import { z } from "zod";

import { LIMITS, MODELS, hasAiGateway } from "@/lib/community/config";
import { fail, handle, json, readJson } from "@/lib/community/http";
import { cleanText, parseCategoryName } from "@/lib/community/validate";

/**
 * "Give me a category name, get 50 things that belong in it."
 *
 * This is the cheap half of the tool. A list of 50 short strings is roughly
 * 1.5K output tokens on a flash-tier model -- a small fraction of a cent, so
 * the AI Gateway's $5/month free credit covers thousands of these. The
 * expensive half is images, which is why those come from free sources and a
 * bounded store rather than a generation API.
 */

const Suggestions = z.object({
  items: z
    .array(
      z.object({
        name: z
          .string()
          .describe("The answer a player shouts when they see the picture."),
        alternatives: z
          .array(z.string())
          .describe(
            "Other phrasings to accept. Nicknames, plurals, the short form. Empty is fine."
          ),
      })
    )
    .describe("Distinct, well-known members of the category."),
});

const SYSTEM = [
  "You suggest answers for a picture round in a party game modelled on the TV",
  "show The Floor. A player sees one image at a time and has to shout the name.",
  "",
  "Good suggestions are:",
  "- instantly recognisable from a single photograph",
  "- concrete and specific, never a category or an abstract idea",
  "- easy to find a clear, well-lit picture of",
  "- varied in difficulty, from gimmes to a few deep cuts",
  "",
  "Skip anything that is only identifiable from text on the image, anything",
  "adult or graphic, and any real private individual. Use the common name",
  "people actually say out loud, not a formal or Latin one.",
].join("\n");

export async function POST(request: Request) {
  return handle(async () => {
    if (!hasAiGateway()) {
      return fail(
        "AI suggestions aren't configured. Set AI_GATEWAY_API_KEY, or type the items in yourself.",
        503
      );
    }

    const body = await readJson(request);
    const name = parseCategoryName(body.name);
    const count = Math.min(
      Math.max(Number(body.count) || 50, 10),
      LIMITS.maxItemsPerCategory
    );

    let output: z.infer<typeof Suggestions>;
    try {
      ({ output } = await generateText({
        model: MODELS.suggestItems,
        system: SYSTEM,
        output: Output.object({ schema: Suggestions }),
        prompt: `Category: "${name}"\n\nSuggest ${count} items.`,
      }));
    } catch (error) {
      // Gateway problems are almost always account setup rather than a bug, and
      // "something went wrong" sends people looking in the wrong place. Pass
      // the reason through -- the author can still type a list either way.
      const detail = error instanceof Error ? error.message : "";

      if (/credit card|verification/i.test(detail)) {
        return fail(
          "The AI Gateway needs a card on file before it will release its free " +
            "monthly credits. Add one in the Vercel dashboard under AI Gateway, " +
            "or just type the items in yourself.",
          503
        );
      }

      if (/credit|quota|balance|limit/i.test(detail)) {
        return fail(
          "The AI Gateway credit for this month is used up. Type the items in " +
            "yourself, or wait for it to refresh.",
          503
        );
      }

      throw error;
    }

    // The model is usually well behaved, but it is not a validator: dedupe and
    // trim here so the create page can render the result without thinking.
    const seen = new Set<string>();
    const items = output.items
      .map((item) => ({
        name: cleanText(item.name),
        alternatives: (item.alternatives ?? [])
          .map(cleanText)
          .filter(Boolean)
          .slice(0, LIMITS.maxAlternativesPerItem),
      }))
      .filter((item) => {
        if (!item.name || item.name.length > LIMITS.maxItemNameLength) {
          return false;
        }
        const key = item.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, count);

    return json({ items });
  });
}
