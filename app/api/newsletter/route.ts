import { NextResponse, type NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { z } from "zod";

import { emailConfig } from "@/config/email";
import { prisma } from "@/db/prisma";
// import ConfirmSubscriptionEmail from "@/emails/ConfirmSubscription";
import { env } from "@/env.mjs";
import { url } from "@/lib";
import { resend } from "@/lib/email";
import { redis } from "@/lib/redis";

const newsletterFormSchema = z.object({
  email: z.string().email().min(1),
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "10 s"),
});

export async function POST(req: NextRequest) {
  const { success } = await ratelimit.limit("subscribe_" + (req.ip ?? ""));
  if (!success) {
    return NextResponse.error();
  }

  try {
    const { data } = await req.json();
    const parsed = newsletterFormSchema.parse(data);

    const subscriber = await prisma.subscribers.findFirst({
      where: {
        email: parsed.email,
      },
    });

    if (subscriber) {
      return NextResponse.json({ status: "success" });
    }

    // generate a random one-time token
    const token = crypto.randomUUID();

    if (env.NODE_ENV === "production") {
      await resend.emails.send({
        from: emailConfig.from,
        to: parsed.email,
        subject: "来自 Koya 的订阅确认",
        html: '<p>请点击 <a href="' + url(`confirm/${token}`).href + '">这里</a> 确认订阅 Koya 的动态。</p>',
        // react: ConfirmSubscriptionEmail({
        //   link: url(`confirm/${token}`).href,
        // }),
      });

      await prisma.subscribers.create({
        data: {
          email: parsed.email,
          token,
        },
      });
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.error();
  }
}
