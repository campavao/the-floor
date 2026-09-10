import { hasAiGateway, serperApiKey } from "@/lib/community/config";
import { handle, json } from "@/lib/community/http";

/**
 * What this deployment can actually do.
 *
 * The create page uses it to decide whether to offer AI suggestions and web
 * image search at all -- better than showing a button that answers 503, and
 * better than hard-coding the assumption that every deployment is configured
 * the same way. Deliberately says nothing about *how* anything is configured.
 */
export async function GET() {
  return handle(async () =>
    json({
      aiSuggestions: hasAiGateway(),
      webImageSearch: Boolean(serperApiKey()),
    })
  );
}
