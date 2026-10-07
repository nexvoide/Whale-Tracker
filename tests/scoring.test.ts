import { describe, expect, it } from "vitest";
import { TransactionDirection } from "@prisma/client";
import { scoreWhaleActivity } from "@/lib/whales/scoring";
describe("whale score", () => { it("scores a large clustered exchange deposit", () => { const result = scoreWhaleActivity({ amountUsd: 110_000_000, direction: TransactionDirection.WHALE_TO_EXCHANGE, clusterCount: 3, marketChangePercent: -2.5 }); expect(result.score).toBe(8); expect(result.reasons).toContain("Large $100M+ transfer"); }); it("always returns the minimum informational score", () => expect(scoreWhaleActivity({ amountUsd: 0, direction: TransactionDirection.UNKNOWN }).score).toBe(1)); });
