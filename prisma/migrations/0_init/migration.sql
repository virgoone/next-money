-- CreateTable
CREATE TABLE "charge_order" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "user_info" JSON,
    "amount" INTEGER NOT NULL,
    "credit" INTEGER NOT NULL,
    "phase" VARCHAR NOT NULL,
    "channel" VARCHAR NOT NULL,
    "currency" VARCHAR NOT NULL,
    "payment_at" TIMESTAMP(6),
    "result" JSON,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charge_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charge_product" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "original_amount" INTEGER NOT NULL,
    "credit" INTEGER NOT NULL,
    "currency" VARCHAR NOT NULL,
    "locale" VARCHAR NOT NULL,
    "title" VARCHAR NOT NULL,
    "tag" JSON,
    "message" TEXT,
    "state" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "charge_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flux_data" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "replicate_id" VARCHAR NOT NULL,
    "input_prompt" TEXT,
    "execute_prompt" TEXT,
    "steps" INTEGER,
    "guidance" INTEGER,
    "interval" INTEGER,
    "image_url" VARCHAR,
    "model" VARCHAR(255) NOT NULL,
    "execute_start_time" BIGINT,
    "execute_end_time" BIGINT,
    "locale" VARCHAR(64),
    "aspect_ratio" VARCHAR NOT NULL,
    "safety_tolerance" INTEGER,
    "seed" INTEGER,
    "task_status" VARCHAR NOT NULL,
    "is_private" BOOLEAN DEFAULT false,
    "download_num" INTEGER NOT NULL DEFAULT 0,
    "views_num" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flux_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flux_downloads" (
    "id" SERIAL NOT NULL,
    "flux_id" INTEGER NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flux_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flux_views" (
    "id" SERIAL NOT NULL,
    "flux_id" INTEGER NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flux_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_code" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(256) NOT NULL,
    "credit_amount" INTEGER NOT NULL,
    "used" BOOLEAN DEFAULT false,
    "used_by" VARCHAR(200),
    "used_at" TIMESTAMP(6),
    "transaction_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(6),

    CONSTRAINT "gift_code_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,
    "url" VARCHAR NOT NULL,
    "color" VARCHAR,
    "blurhash" VARCHAR,
    "file_size" INTEGER NOT NULL,
    "file_type" VARCHAR NOT NULL,
    "md5" VARCHAR NOT NULL,
    "ext" JSON,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(200),
    "body" TEXT,
    "locale" VARCHAR(10),
    "sent_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(120),
    "token" VARCHAR(50),
    "locale" VARCHAR(10),
    "subscribed_at" TIMESTAMP(6),
    "unsubscribed_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_billing" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "state" VARCHAR NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" VARCHAR NOT NULL,
    "flux_id" INTEGER,
    "description" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credit" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "credit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credit_transaction" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "credit" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "billing_id" INTEGER,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credit_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_payment_info" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "user_info" JSON,
    "stripe_customer_id" VARCHAR,
    "stripe_subscription_id" VARCHAR,
    "stripe_price_id" VARCHAR,
    "stripe_current_period_end" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_payment_info_pkey" PRIMARY KEY ("id")
);

