ALTER TABLE "gift_code" ADD COLUMN "expired_at" timestamp;--> statement-breakpoint
ALTER TABLE "gift_code" DROP COLUMN IF EXISTS "updated_at";