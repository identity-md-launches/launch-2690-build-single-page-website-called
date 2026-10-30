export const API = {
  status: 'https://api.squeekchain.com/v1/status',
  settlements: 'https://api.squeekchain.com/v1/settlements?range=24h',
  economy: 'https://api.squeekchain.com/v1/economy/state',
} as const;
export const REFRESH_MS = 10_000;
export const REQUEST_TIMEOUT_MS = 8_000;

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as RecordValue)
    : {};
const text = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null;
export const finiteNumber = (value: unknown): number | null => {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};
export const integerString = (value: unknown): string | null => {
  if (typeof value === 'string' && /^\d+$/.test(value)) return value;
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0)
    return String(value);
  return null;
};
const timestamp = (value: unknown): string | null => {
  const s = text(value);
  return s && Number.isFinite(Date.parse(s)) ? s : null;
};

export interface Status {
  work: string | null;
  rpm: number | null;
  speed: number | null;
  core: 'SPINNING' | 'IDLE' | null;
  block: string | null;
  progress: number | null;
  observedAt: string | null;
  staleAfterSeconds: number;
  freshness: string | null;
}
export interface Settlement {
  hash: string;
  round: string | null;
  work: string | null;
  blocks: string | null;
  time: string | null;
  confirmation: string | null;
}
export interface Bucket {
  start: string;
  end: string | null;
  count: number;
  work: number | null;
}
export interface Settlements {
  count: string | null;
  blocks: string | null;
  work: string | null;
  activeRounds: string | null;
  recent: Settlement[];
  buckets: Bucket[];
  chainId: string | null;
  windowStart: string | null;
  windowEnd: string | null;
}
export interface Economy {
  symbol: string;
  decimals: number | null;
  supply: string | null;
  cap: string | null;
  mined: string | null;
  round: string | null;
  chain: string | null;
  stage: string | null;
  paused: boolean | null;
}

export function parseStatus(raw: unknown): Status {
  const d = record(raw),
    m = record(d.measurement),
    b = record(record(d.builder).anchor);
  if (!('measurement' in d)) throw new Error('Unexpected telemetry response');
  const rpmMilli = finiteNumber(m.rpmMilli),
    p = finiteNumber(b.blockProgress);
  return {
    work: integerString(m.cumulativeWorkUnits),
    rpm: rpmMilli === null ? null : rpmMilli / 1000,
    speed: finiteNumber(m.speedMmPerSecond),
    core:
      m.coreStatus === 'SPINNING' || m.coreStatus === 'IDLE'
        ? m.coreStatus
        : null,
    block: integerString(b.blockHeight),
    progress: p === null || p > 1e9 ? null : (p / 1e9) * 100,
    observedAt: timestamp(m.observedAt),
    staleAfterSeconds: finiteNumber(m.staleAfterSeconds) ?? 120,
    freshness: text(m.freshness),
  };
}

export function parseSettlements(raw: unknown): Settlements {
  const d = record(raw),
    s = record(d.summary),
    w = record(d.window);
  if (d.status !== 'available' || !('summary' in d))
    throw new Error('Settlements unavailable');
  const recent = (Array.isArray(d.recentSettlements) ? d.recentSettlements : [])
    .map(record)
    .filter(
      (r) =>
        typeof r.transactionHash === 'string' &&
        /^0x[a-fA-F0-9]{64}$/.test(r.transactionHash),
    )
    .map((r) => ({
      hash: r.transactionHash as string,
      round: integerString(r.settledThroughRound),
      work: integerString(r.workAdded),
      blocks: integerString(r.completedBlockCount),
      time: timestamp(r.blockTimestamp),
      confirmation: text(r.confirmationStatus),
    }));
  const buckets = (Array.isArray(d.buckets) ? d.buckets : [])
    .map(record)
    .filter(
      (b) => timestamp(b.startAt) && finiteNumber(b.settlementCount) !== null,
    )
    .map((b) => ({
      start: b.startAt as string,
      end: timestamp(b.endAt),
      count: finiteNumber(b.settlementCount)!,
      work: finiteNumber(b.workAdded),
    }));
  return {
    count: integerString(s.settlementCount),
    blocks: integerString(s.completedBlockCount),
    work: integerString(s.workAdded),
    activeRounds: integerString(s.activeRoundCount),
    recent,
    buckets,
    chainId: integerString(record(d.chain).chainId),
    windowStart: timestamp(w.startAt),
    windowEnd: timestamp(w.endAt),
  };
}

export function parseEconomy(raw: unknown): Economy {
  const d = record(raw),
    a = record(d.asset),
    s = record(d.supply),
    l = record(d.lifecycle);
  if (d.status !== 'available' || !('supply' in d))
    throw new Error('Economy unavailable');
  const decimals = finiteNumber(a.decimals);
  return {
    symbol: text(a.symbol) ?? 'Token',
    decimals:
      decimals !== null && Number.isInteger(decimals) && decimals <= 36
        ? decimals
        : null,
    supply: integerString(s.liveSupplyBaseUnits),
    cap: integerString(s.capBaseUnits),
    mined: integerString(s.miningMintedBaseUnits),
    round: integerString(l.currentRound),
    chain: text(record(d.chain).target),
    stage: text(l.stage),
    paused: typeof l.paused === 'boolean' ? l.paused : null,
  };
}

export const formatInteger = (value: string | null | undefined): string =>
  value == null
    ? 'Unavailable'
    : new Intl.NumberFormat('en-US').format(BigInt(value));
export const formatNumber = (
  value: number | null | undefined,
  digits = 1,
): string =>
  value == null
    ? 'Unavailable'
    : value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

/** Truncate base units with BigInt; never round a large token balance through Number. */
export function formatTokens(
  value: string | null | undefined,
  decimals: number | null | undefined,
  fractionDigits = 2,
): string {
  if (value == null || decimals == null) return 'Unavailable';
  const n = BigInt(value),
    scale = 10n ** BigInt(decimals);
  const whole = new Intl.NumberFormat('en-US').format(n / scale);
  const precision = Math.min(fractionDigits, decimals);
  if (!precision) return whole;
  const fraction = (n % scale)
    .toString()
    .padStart(decimals, '0')
    .slice(0, precision);
  return `${whole}.${fraction}`;
}

export function isTelemetryStale(
  status: Status | null,
  now = Date.now(),
): boolean {
  if (!status) return false;
  return (
    (status.freshness !== null && status.freshness !== 'online') ||
    (status.observedAt !== null &&
      now - Date.parse(status.observedAt) > status.staleAfterSeconds * 1000)
  );
}

export async function fetchData<T>(
  url: string,
  parse: (data: unknown) => T,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(url, {
    signal,
    cache: 'no-store',
    credentials: 'omit',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parse(await response.json());
}
