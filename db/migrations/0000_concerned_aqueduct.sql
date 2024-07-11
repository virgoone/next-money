CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"user_info" json,
	"post_id" varchar(100) NOT NULL,
	"parent_id" integer,
	"body" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "face_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"age" integer NOT NULL,
	"url" varchar NOT NULL,
	"dominant_emotion" varchar NOT NULL,
	"dominant_gender" varchar NOT NULL,
	"dominant_race" varchar NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"deep_face" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "face_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"face_id" integer NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "face_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"face_id" integer NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"key" varchar NOT NULL,
	"url" varchar NOT NULL,
	"color" varchar,
	"blurhash" varchar,
	"file_size" integer NOT NULL,
	"file_type" varchar NOT NULL,
	"md5" varchar NOT NULL,
	"ext" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newsletters" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" varchar(200),
	"body" text,
	"locale" varchar(10),
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(120),
	"token" varchar(50),
	"locale" varchar(10),
	"subscribed_at" timestamp,
	"unsubscribed_at" timestamp,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_payment_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"user_info" json,
	"stripe_customer_id" varchar,
	"stripe_subscription_id" varchar,
	"stripe_price_id" varchar,
	"stripe_current_period_end" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_idx" ON "comments" USING btree (post_id);