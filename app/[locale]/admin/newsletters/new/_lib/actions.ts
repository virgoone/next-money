"use server";

import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

import { emailConfig } from "@/config/email";
import { prisma } from "@/db/prisma";
import NewslettersTemplate from "@/emails/NewslettersTemplate";
import { env } from "@/env.mjs";
import { resend } from "@/lib/email";
import { getErrorMessage } from "@/lib/handle-error";

import { CreateNewsletterSchema, CreateSchema } from "./validations";

export async function createAction(input: CreateSchema) {
  noStore();
  try {
    const data = input;

    const subs = await prisma.subscribers.findMany({
      where: {
        subscribedAt: {
          lte: new Date(),
        },
      },
    });

    const subscriberEmails = new Set([
      ...subs
        .filter((sub) => typeof sub.email === "string" && sub.email.length > 0)
        .map((sub) => sub.email),
    ]);

    await resend.emails.send({
      subject: data.subject,
      from: emailConfig.from,
      to: env.SITE_NOTIFICATION_EMAIL_TO ?? [],
      reply_to: emailConfig.from,
      bcc: Array.from(subscriberEmails!) as string[],
      react: NewslettersTemplate({
        subject: data.subject,
        body: data.body,
      }),
    });

    await prisma.newsletters.create({
      data: {
        ...data,
      },
    });

    redirect("/admin/newsletters");
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
