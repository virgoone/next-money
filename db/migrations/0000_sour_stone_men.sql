CREATE TABLE IF NOT EXISTS "charge_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"user_info" json,
	"amount" integer NOT NULL,
	"phase" varchar NOT NULL,
	"channel" varchar NOT NULL,
	"currency" varchar NOT NULL,
	"payment_at" timestamp,
	"result" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "charge_product" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"original_amount" integer NOT NULL,
	"credit" integer NOT NULL,
	"currency" varchar NOT NULL,
	"locale" varchar NOT NULL,
	"title" varchar NOT NULL,
	"tag" json,
	"message" text,
	"state" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "flux_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"replicate_id" varchar NOT NULL,
	"input_prompt" text,
	"execute_prompt" text,
	"steps" integer,
	"guidance" integer,
	"interval" integer,
	"image_url" varchar,
	"model" varchar NOT NULL,
	"execute_start_time" integer,
	"execute_end_time" integer,
	"locale" varchar(64),
	"aspect_ratio" varchar NOT NULL,
	"safety_tolerance" integer,
	"seed" integer,
	"task_status" varchar NOT NULL,
	"is_private" boolean DEFAULT false,
	"download_num" integer DEFAULT 0 NOT NULL,
	"views_num" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flux_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"flux_id" integer NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flux_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"flux_id" integer NOT NULL,
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
CREATE TABLE IF NOT EXISTS "user_billing" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"credit" integer NOT NULL,
	"state" varchar NOT NULL,
	"detail" json NOT NULL,
	"account" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_credit" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"credit" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_credit_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(200) NOT NULL,
	"credit" integer NOT NULL,
	"balance" integer NOT NULL,
	"billing_id" integer,
	"type" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
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