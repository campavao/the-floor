import { NextResponse } from "next/server";

import { ImageRejected } from "./images";
import { InvalidInput } from "./validate";

export const json = <T>(data: T, status = 200) =>
  NextResponse.json(data, { status });

export const fail = (message: string, status = 400) =>
  NextResponse.json({ error: message }, { status });

/**
 * One place to turn the "you gave me something I won't accept" errors into 400s
 * and everything else into a 500 with the detail kept server-side.
 */
export const handle = async (
  run: () => Promise<Response>
): Promise<Response> => {
  try {
    return await run();
  } catch (error) {
    if (error instanceof InvalidInput || error instanceof ImageRejected) {
      return fail(error.message, 400);
    }

    console.error("[community]", error);
    return fail("Something went wrong on our end. Try again.", 500);
  }
};

export const readJson = async (
  request: Request
): Promise<Record<string, unknown>> => {
  try {
    const body = await request.json();
    return body && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    throw new InvalidInput("Expected a JSON body.");
  }
};
