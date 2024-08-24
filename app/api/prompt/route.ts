import { NextResponse, type NextRequest } from "next/server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import OpenAI from "openai";
import { z } from "zod";

import { env } from "@/env.mjs";
import { getErrorMessage } from "@/lib/handle-error";
import { redis } from "@/lib/redis";

const CreatePromptSchema = z.object({
  prompt: z.string(),
});

const client = new OpenAI({
  baseURL: env.OPEN_AI_API_ENDPOINT,
  apiKey: env.OPEN_AI_API_KEY, // This is the default and can be omitted
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "5 s"),
  analytics: true,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();

  const user = await currentUser();
  if (!userId || !user || !user.primaryEmailAddress) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { success } = await ratelimit.limit(
    "get-prompt:redeemed" + `_${req.ip ?? ""}`,
  );
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
    });
  }

  try {
    const data = await req.json();
    const { prompt } = CreatePromptSchema.parse(data);
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        {
          role: "system",
          content: env.FLUX_AI_PROMPT,
        },
        { role: "user", content: prompt },
      ],
      model: env.OPEN_AI_MODEL,
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await client.chat.completions.create(params);

    return NextResponse.json(
      {
        prompt: chatCompletion.choices?.[0]?.message?.content ?? "",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}
