import {
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

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    userInfo: json("user_info"),
    postId: varchar("post_id", { length: 100 }).notNull(),
    parentId: integer("parent_id"),
    body: json("body"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    postIdx: index("post_idx").on(table.postId),
  }),
);

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
  reward: integer("reward").notNull(),
  currency: varchar("currency").notNull(),
  tag: json("tag"),
  message: varchar("message"),
  state: varchar("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chargeOrder = pgTable("charge_order", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  userInfo: json("user_info"),
  amount: integer("amount").notNull(),
  phase: varchar("phase").notNull(),
  channel: varchar("channel").notNull(),
  currency: varchar("currency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userCoin = pgTable("user_coin", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  coin: integer("coin").notNull(),
  reward: integer("reward").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userCoinTransaction = pgTable("user_coin_transaction", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  type: varchar("type").notNull(),
  coin: integer("coin").notNull(),
  reward: integer("reward").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const face = pgTable("face_data", {
  id: serial("id").primaryKey(),
  age: integer("age").notNull(),
  url: varchar("url").notNull(),
  dominantEmotion: varchar("dominant_emotion").notNull(),
  dominantGender: varchar("dominant_gender").notNull(),
  dominantRace: varchar("dominant_race").notNull(),
  downloads: integer("downloads").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  deepFace: json("deep_face"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faceDownloads = pgTable("face_downloads", {
  id: serial("id").primaryKey(),
  faceId: integer("face_id").notNull(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const faceViews = pgTable("face_views", {
  id: serial("id").primaryKey(),
  faceId: integer("face_id").notNull(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
