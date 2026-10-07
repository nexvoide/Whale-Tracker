ALTER TABLE "Alert" ADD COLUMN "sentToDiscord" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Alert" SET "sentToDiscord" = "sentToTelegram";
