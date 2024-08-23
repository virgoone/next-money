/*
  Warnings:

  - Made the column `created_at` on table `charge_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `charge_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `charge_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `charge_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `flux_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `flux_data` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `flux_downloads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `flux_downloads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `flux_views` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `flux_views` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `gift_code` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `newsletters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `newsletters` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `subscribers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user_billing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_billing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user_credit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_credit` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user_credit_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_credit_transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `user_payment_info` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `user_payment_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "charge_order" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "charge_product" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "flux_data" ADD COLUMN     "error_msg" TEXT,
ADD COLUMN     "input_image_url" VARCHAR,
ADD COLUMN     "lora_name" VARCHAR(255),
ADD COLUMN     "lora_scale" DOUBLE PRECISION,
ADD COLUMN     "lora_url" VARCHAR(255),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "flux_downloads" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "flux_views" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "gift_code" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "media" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "newsletters" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "subscribers" ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_billing" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_credit" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_credit_transaction" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_payment_info" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateTable
CREATE TABLE "claimed_activity_order" (
    "id" SERIAL NOT NULL,
    "charge_order_id" INTEGER NOT NULL,
    "user_id" VARCHAR(200) NOT NULL,
    "credit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activity_code" VARCHAR(200) NOT NULL,
    "transaction_id" INTEGER,

    CONSTRAINT "claimed_activity_order_pkey" PRIMARY KEY ("id")
);
