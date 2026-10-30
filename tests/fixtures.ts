// Synthetic fixtures for deterministic tests only. The production app never imports this file.
export const fixedNow = '2026-10-30T06:00:00.000Z';
export function statusFixture(n = 0) {
  return {
    measurement: {
      cumulativeWorkUnits: String(45758 + n),
      rpmMilli: 12345 + n * 1000,
      speedMmPerSecond: 181 + n,
      coreStatus: 'SPINNING',
      freshness: 'online',
      observedAt: fixedNow,
      staleAfterSeconds: 120,
    },
    builder: {
      anchor: {
        blockHeight: String(4118 + n),
        blockProgress: String(503463521 + n * 1000000),
      },
    },
  };
}
export function settlementsFixture(n = 0) {
  return {
    status: 'available',
    chain: { chainId: '11155111' },
    summary: {
      settlementCount: String(140 + n),
      completedBlockCount: String(1124 + n),
      workAdded: String(13098 + n),
    },
    recentSettlements: Array.from({ length: 10 }, (_, i) => ({
      transactionHash: `0x${String(i + 1).padStart(64, 'a')}`,
      settledThroughRound: String(530 - i),
      workAdded: String(466 - i),
      completedBlockCount: String(39 - i),
      blockTimestamp: '2026-10-30T04:10:36Z',
      confirmationStatus: 'safe',
    })),
    buckets: Array.from({ length: 24 }, (_, i) => ({
      startAt: new Date(
        Date.parse(fixedNow) - (24 - i) * 3600000,
      ).toISOString(),
      settlementCount: String(i % 7),
      workAdded: String(i * 100),
    })),
  };
}
export function economyFixture(n = 0) {
  return {
    status: 'available',
    asset: { symbol: 'SQK', decimals: 18 },
    supply: {
      liveSupplyBaseUnits: `${16387784 + n}750000000000000000`,
      capBaseUnits: '2100000000000000000000000000',
    },
    lifecycle: {
      stage: 'active',
      paused: false,
      currentRound: String(531 + n),
    },
    chain: { target: 'sepolia' },
  };
}
