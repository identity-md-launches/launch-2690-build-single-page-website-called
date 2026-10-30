import assert from 'node:assert/strict';
import test from 'node:test';
import {
  finiteNumber,
  formatInteger,
  formatTokens,
  integerString,
  isTelemetryStale,
  parseEconomy,
  parseSettlements,
  parseStatus,
} from '../src/data.ts';

test('wheel conversions, anchor progress and genuine zero readings', () => {
  const s = parseStatus({
    measurement: {
      cumulativeWorkUnits: '9007199254740993',
      rpmMilli: 12550,
      speedMmPerSecond: 181,
      coreStatus: 'SPINNING',
    },
    builder: { anchor: { blockHeight: '4118', blockProgress: '503463521' } },
  });
  assert.equal(s.rpm, 12.55);
  assert.ok(Math.abs(s.progress! - 50.3463521) < 1e-10);
  assert.equal(formatInteger(s.work), '9,007,199,254,740,993');
  const idle = parseStatus({
    measurement: { rpmMilli: 0, speedMmPerSecond: 0, coreStatus: 'IDLE' },
    builder: { anchor: { blockProgress: '0', blockHeight: '0' } },
  });
  assert.equal(idle.rpm, 0);
  assert.equal(idle.progress, 0);
  assert.equal(idle.core, 'IDLE');
});

test('missing, malformed and unsafe readings never become made-up zeroes', () => {
  for (const value of [
    null,
    undefined,
    '',
    ' ',
    false,
    NaN,
    Infinity,
    -1,
    {},
    'abc',
  ])
    assert.equal(finiteNumber(value), null);
  assert.equal(integerString(9007199254740992), null);
  const s = parseStatus({
    measurement: { rpmMilli: null, coreStatus: 'BROKEN' },
    builder: { anchor: { blockProgress: '1000000001' } },
  });
  assert.equal(s.rpm, null);
  assert.equal(s.work, null);
  assert.equal(s.core, null);
  assert.equal(s.progress, null);
  assert.throws(() => parseStatus({}));
});

test('token amounts preserve precision, decimals and tiny amounts', () => {
  assert.equal(formatTokens('16387784752755398547956254', 18), '16,387,784.75');
  assert.equal(
    formatTokens('2100000000000000000000000000', 18, 0),
    '2,100,000,000',
  );
  assert.equal(formatTokens('1', 18), '0.00');
  assert.equal(formatTokens('12345', 2), '123.45');
  assert.equal(formatTokens('12', 0), '12');
  assert.equal(formatTokens(null, 18), 'Unavailable');
  assert.equal(formatTokens('12', null), 'Unavailable');
});

test('settlement summary is independent of the limited recent list', () => {
  const s = parseSettlements({
    status: 'available',
    summary: {
      settlementCount: '140',
      workAdded: '13098',
      completedBlockCount: '1124',
    },
    recentSettlements: [
      {
        transactionHash: `0x${'a'.repeat(64)}`,
        settledThroughRound: '518',
        workAdded: '466',
      },
    ],
    buckets: [
      { startAt: '2026-10-30T03:00:00Z', settlementCount: '6', workAdded: '0' },
    ],
    chain: { chainId: '11155111' },
  });
  assert.equal(s.count, '140');
  assert.equal(s.recent.length, 1);
  assert.equal(s.buckets[0].count, 6);
  assert.equal(s.buckets[0].work, 0);
  assert.equal(s.chainId, '11155111');
  assert.throws(() => parseSettlements({ status: 'unavailable' }));
});

test('stale observation timestamps and upstream freshness are surfaced', () => {
  const raw = {
    measurement: {
      observedAt: '2026-10-30T03:00:00Z',
      freshness: 'online',
      staleAfterSeconds: 120,
    },
  };
  assert.equal(
    isTelemetryStale(parseStatus(raw), Date.parse('2026-10-30T03:01:00Z')),
    false,
  );
  assert.equal(
    isTelemetryStale(parseStatus(raw), Date.parse('2026-10-30T03:03:00Z')),
    true,
  );
  assert.equal(
    isTelemetryStale(parseStatus({ measurement: { freshness: 'offline' } })),
    true,
  );
});

test('economy consumes authoritative fields and rejects unavailable source', () => {
  const e = parseEconomy({
    status: 'available',
    supply: { liveSupplyBaseUnits: '12345', capBaseUnits: '90000' },
    asset: { decimals: 2, symbol: 'SQK' },
    lifecycle: { currentRound: '531', paused: false, stage: 'active' },
    chain: { target: 'sepolia' },
  });
  assert.equal(formatTokens(e.supply, e.decimals), '123.45');
  assert.equal(e.round, '531');
  assert.equal(e.chain, 'sepolia');
  assert.throws(() => parseEconomy({ status: 'unavailable' }));
});
