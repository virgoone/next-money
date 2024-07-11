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
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  url: text("url").notNull(),
  color: text("color"),
  blurhash: text("blurhash"),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(),
  md5: text("md5").notNull(),
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
})

export const faceViews = pgTable("face_views", {
  id: serial("id").primaryKey(),
  faceId: integer("face_id").notNull(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})