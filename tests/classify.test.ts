import { describe, expect, it } from "vitest";
import { TransactionDirection, WalletType } from "@prisma/client";
import { classifyTransaction } from "@/lib/wallets/classify";
const whale = { address: "whale", type: WalletType.WHALE, isTracked: true };
const exchange = { address: "exchange", type: WalletType.EXCHANGE, isTracked: true };
describe("transaction classification", () => { it("classifies verified whale to exchange", () => expect(classifyTransaction(whale, exchange)).toBe(TransactionDirection.WHALE_TO_EXCHANGE)); it("does not infer unknown relationships", () => expect(classifyTransaction(undefined, exchange)).toBe(TransactionDirection.UNKNOWN)); });
