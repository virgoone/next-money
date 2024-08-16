import {
  bigint,
  boolean,
  index,
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 120 }),
  token: varchar("token", { length: 50 }),
  locale: varchar("locale", { length: 10 }),
  subscribedAt: timestamp("subscribed_at"),
  unsubscribedAt: timestamp("unsubscribed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  subject: varchar("subject", { length: 200 }),
  body: text("body"),
  locale: varchar("locale", { length: 10 }),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  key: varchar("key").notNull(),
  url: varchar("url").notNull(),
  color: varchar("color"),
  blurhash: varchar("blurhash"),
  fileSize: integer("file_size").notNull(),
  fileType: varchar("file_type").notNull(),
  md5: varchar("md5").notNull(),
  ext: json("ext"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userPaymentInfo = pgTable("user_payment_info", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  userInfo: json("user_info"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  stripePriceId: varchar("stripe_price_id"),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chargeProduct = pgTable("charge_product", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  originalAmount: integer("original_amount").notNull(),
  credit: integer("credit").notNull(),
  currency: varchar("currency").notNull(),
  locale: varchar("locale").notNull(),
  title: varchar("title").notNull(),
  tag: json("tag"),
  message: text("message"),
  state: varchar("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ChargeProductDto = Omit<typeof chargeProduct.$inferSelect, "id"> & {
  id: string;
};

export const chargeOrder = pgTable("charge_order", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  userInfo: json("user_info"),
  amount: integer("amount").notNull(),
  credit: integer("credit").notNull(),
  phase: varchar("phase").notNull(),
  channel: varchar("channel").notNull(),
  currency: varchar("currency").notNull(),
  paymentAt: timestamp("payment_at"),
  result: json("result"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const giftCode = pgTable("gift_code", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 256 }).notNull(),
  creditAmount: integer("credit_amount").notNull(),
  used: boolean("used").default(false),
  usedBy: varchar("used_by", { length: 200 }),
  usedAt: timestamp("used_at"),
  transactionId: integer("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
  expiredAt: timestamp("expired_at"),
});

export type GiftCodeSchemaDto = typeof giftCode.$inferSelect;

export type GiftCodeDto = Omit<GiftCodeSchemaDto, "id"> & {
  id: string;
};

export type ChargeOrderDto = typeof chargeOrder.$inferSelect;

export const userCredit = pgTable("user_credit", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  credit: integer("credit").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserCreditDto = typeof userCredit.$inferSelect;

export const userCreditTransaction = pgTable("user_credit_transaction", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  credit: integer("credit").notNull(), // 消耗积分
  balance: integer("balance").notNull(), // 余额
  billingId: integer("billing_id"),
  type: varchar("type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export enum BillingType {
  Refund = "Refund", // 退款
  Withdraw = "Withdraw",
}

export const userBilling = pgTable("user_billing", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  state: varchar("state").notNull(),
  amount: integer("amount").notNull(),
  type: varchar("type").notNull(),
  fluxId: integer("flux_id"),
  description: varchar("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export enum FluxTaskStatus {
  Processing = "processing",
  Succeeded = "succeeded",
  Failed = "failed",
  Canceled = "canceled",
}

export const flux = pgTable("flux_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  replicateId: varchar("replicate_id").notNull(),
  inputPrompt: text("input_prompt"),
  executePrompt: text("execute_prompt"),
  steps: integer("steps"),
  guidance: integer("guidance"),
  interval: integer("interval"),
  imageUrl: varchar("image_url"),
  model: varchar("model", { length: 255 }).notNull(),
  executeStartTime: bigint("execute_start_time", { mode: "bigint" }),
  executeEndTime: bigint("execute_end_time", { mode: "bigint" }),
  locale: varchar("locale", { length: 64 }),
  aspectRatio: varchar("aspect_ratio").notNull(),
  safetyTolerance: integer("safety_tolerance"),
  seed: integer("seed"),
  taskStatus: varchar("task_status").notNull(),
  isPrivate: boolean("is_private").default(false),
  downloadNum: integer("download_num").default(0).notNull(),
  viewsNum: integer("views_num").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FluxSchemaDto = typeof flux.$inferSelect;

export type FluxDto = Omit<FluxSchemaDto, "id"> & {
  id: string;
};

export const fluxDownloads = pgTable("flux_downloads", {
  id: serial("id").primaryKey(),
  fluxId: integer("flux_id").notNull(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fluxViews = pgTable("flux_views", {
  id: serial("id").primaryKey(),
  fluxId: integer("flux_id").notNull(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
