import { NextResponse } from "next/server";

import cors from "edge-cors";
import { getTweet } from "react-tweet/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tweet = await getTweet(id);
    return cors(
      req,
      NextResponse.json({ data: tweet ?? null }, { status: tweet ? 200 : 404 }),
    );
  } catch (error: any) {
    return cors(
      req,
      NextResponse.json(
        { error: error.message ?? "Bad request." },
        { status: 400 },
      ),
    );
  }
}
