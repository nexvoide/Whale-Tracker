CREATE TABLE "Wallet" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "address" TEXT NOT NULL,
  "label" TEXT,
  "type" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "btcBalance" REAL,
  "firstSeenAt" DATETIME,
  "lastSeenAt" DATETIME,
  "isTracked" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE UNIQUE INDEX "Wallet_address_key" ON "Wallet"("address");
CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "txid" TEXT NOT NULL,
  "amountBtc" REAL NOT NULL,
  "amountUsd" REAL NOT NULL,
  "direction" TEXT NOT NULL DEFAULT 'UNKNOWN',
  "timestamp" DATETIME NOT NULL,
  "status" TEXT NOT NULL,
  "sourceAddress" TEXT,
  "destinationAddress" TEXT,
  "sourceWalletId" TEXT,
  "destinationWalletId" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_sourceWalletId_fkey" FOREIGN KEY ("sourceWalletId") REFERENCES "Wallet" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Transaction_destinationWalletId_fkey" FOREIGN KEY ("destinationWalletId") REFERENCES "Wallet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Transaction_txid_key" ON "Transaction"("txid");
CREATE INDEX "Transaction_timestamp_idx" ON "Transaction"("timestamp");
CREATE INDEX "Transaction_direction_idx" ON "Transaction"("direction");
CREATE TABLE "Alert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "transactionId" TEXT,
  "alertType" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "sentToTelegram" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Alert_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE "PriceSnapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "symbol" TEXT NOT NULL,
  "price" REAL NOT NULL,
  "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "PriceSnapshot_symbol_timestamp_idx" ON "PriceSnapshot"("symbol", "timestamp");
