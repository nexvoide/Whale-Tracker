/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient, WalletType } = require("@prisma/client");

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node scripts/import-bitinfocharts-wallets.js /path/to/registry.md");
const databaseUrl = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const database = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const allowedTypes = new Set(Object.values(WalletType));
const sourceName = "BitInfoCharts";
const snapshotAt = new Date();
const text = fs.readFileSync(path.resolve(sourcePath), "utf8");
const blocks = text.split(/^## Rank /m).slice(1).map((section) => { const [rank, ...lines] = section.split("\n"); return { rank: Number(rank.trim()), block: lines.join("\n") }; });
const field = (block, name) => new RegExp("\\*\\*" + name + ":\\*\\*\\s*(?:`([^`]+)`|([^\\n]+))", "i").exec(block)?.slice(1).find(Boolean)?.trim();
const decimal = (value) => value ? Number(value.replace(/[$,%]/g, "").replace(/,/g, "")) : null;
const integer = (value) => value && !/not supplied/i.test(value) ? Number(value.replace(/,/g, "")) : null;
const date = (value) => value && !/not supplied/i.test(value) ? new Date(`${value.replace(" ", "T")}Z`) : null;
const validAddress = (address) => /^(bc1[ac-hj-np-z02-9]{11,87}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(address);
const parse = ({ rank, block }) => { const address = field(block, "Address")?.split(/\s+/)[0]; const type = field(block, "Type"); return { rank, address, label: field(block, "Label"), type: allowedTypes.has(type) ? type : "UNKNOWN", entity: field(block, "Entity"), confidence: field(block, "Confidence") ?? "UNKNOWN", sourceUrl: field(block, "Source URL"), balanceBtc: decimal(field(block, "Balance")), balanceUsdSnapshot: decimal(field(block, "USD Snapshot")), percentCoins: decimal(field(block, "% of Coins")), flowNotes: field(block, "Flow Notes"), firstInAt: date(field(block, "First In")), lastSeenAt: date(field(block, "Last In")), totalIns: integer(field(block, "Ins")), firstOutAt: date(field(block, "First Out")), totalOuts: integer(field(block, "Outs")) }; };

async function main() { const records = blocks.map(parse); const invalid = records.filter((record) => !record.address || !validAddress(record.address)); const unique = new Set(records.map((record) => record.address)); if (records.length !== 100 || invalid.length || unique.size !== records.length) throw new Error(`Registry validation failed: records=${records.length}, unique=${unique.size}, invalid=${invalid.length}`); let imported = 0; let preservedManual = 0; for (const record of records) { let entityId = null; if (record.entity && record.entity.toLowerCase() !== "unknown") { const entity = await database.entity.upsert({ where: { name: record.entity }, update: {}, create: { name: record.entity, type: record.type, confidence: record.confidence, source: sourceName } }); entityId = entity.id; } const existing = await database.wallet.findUnique({ where: { address: record.address } }); const base = { btcBalance: record.balanceBtc, balanceUsdSnapshot: record.balanceUsdSnapshot, rank: record.rank, sourceWalletLabel: record.label, sourceUrl: record.sourceUrl, discoverySource: sourceName, discoveryConfidence: record.confidence, flowNotes: record.flowNotes, percentCoins: record.percentCoins, firstInAt: record.firstInAt, lastSeenAt: record.lastSeenAt, totalIns: record.totalIns, firstOutAt: record.firstOutAt, totalOuts: record.totalOuts, sourceSnapshotAt: snapshotAt, lastCheckedAt: snapshotAt, discoveredAt: existing?.discoveredAt ?? snapshotAt, isActiveDiscovery: true, isTracked: true }; const classification = existing?.isManuallyVerified ? {} : { label: record.label, type: record.type, entityId }; if (existing?.isManuallyVerified) preservedManual += 1; await database.wallet.upsert({ where: { address: record.address }, update: { ...base, ...classification }, create: { address: record.address, firstSeenAt: record.firstInAt ?? snapshotAt, ...base, ...classification } }); imported += 1; } console.log(JSON.stringify({ sourceRecords: records.length, uniqueAddresses: unique.size, duplicates: records.length - unique.size, invalidAddresses: invalid.length, imported, preservedManual }, null, 2)); }
main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => database.$disconnect());
