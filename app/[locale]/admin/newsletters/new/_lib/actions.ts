'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import { lte } from 'drizzle-orm'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { newsletters, subscribers } from '~/db/schema'
import NewslettersTemplate from '~/emails/NewslettersTemplate'
import { env } from '~/env.mjs'
import { getErrorMessage } from '~/lib/handle-error'
import { resend } from '~/lib/mail'

import { CreateNewsletterSchema, CreateSchema } from './validations'

export async function createAction(input: CreateSchema) {
  noStore()
  try {
    const data = input

    const subs = await db
      .select({
        email: subscribers.email,
      })
      .from(subscribers)
      .where(lte(subscribers.subscribedAt, new Date()))
    const subscriberEmails = new Set([
      ...subs
        .filter((sub) => typeof sub.email === 'string' && sub.email.length > 0)
        .map((sub) => sub.email),
    ])

    await resend.emails.send({
      subject: data.subject,
      from: emailConfig.from,
      to: env.SITE_NOTIFICATION_EMAIL_TO ?? [],
      reply_to: emailConfig.from,
      bcc: Array.from(subscriberEmails),
      react: NewslettersTemplate({
        subject: data.subject,
        body: data.body,
      }),
    })

    await db.insert(newsletters).values({
      ...data,
    })

    redirect('/admin/newsletters')
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
