import { repo } from "@/lib/community/db";
import { handle, json } from "@/lib/community/http";

/**
 * Which languages the browse page can filter by, and how many categories each
 * has. Only languages with something in them -- an empty option is a dead end.
 */
export async function GET() {
  return handle(async () => {
    const languages = await repo().languageCounts();
    return json({ languages });
  });
}
