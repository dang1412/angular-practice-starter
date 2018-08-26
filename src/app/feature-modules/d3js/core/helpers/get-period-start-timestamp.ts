export const periodToResolution = {
  // 1 minute
  '1hour': 60 * 1000,
  // 15 minute
  '1day': 15 * 60 * 1000,
  // 1 hour
  '1week': 60 * 60 * 1000,
  // 4 hour
  '1month': 4 * 60 * 60 * 1000,
  // 24 hour
  '1year': 24 * 60 * 60 * 1000,
};

export function getPeriodStartTimestamp(timestamp: number, period: string): number {
  return timestamp - (timestamp % periodToResolution[period]);
}
