import { ChartPoint } from '../models';
import { periodToResolution, getPeriodStartTimestamp } from './get-period-start-timestamp';

const pairToBoundPricesMap = {
  btc_jpy: [600000, 900000],
  xrp_jpy: [50, 100],
  mona_jpy: [200, 400],
  bcc_jpy: [70000, 100000],
};

const periodToCountMap = {
  // 1 minute
  '1hour': 60,
  // 15 minute
  // '1day': 4 * 24,
  '1day': 96,
  // 1 hour
  '1week': 24 * 7,
  // '1week': 12,
  // 4 hour
  '1month': 6 * 30,
  // 24 hour
  '1year': 365,
};

export function mockChartData(pair: string, period: string): ChartPoint[] {
  const endTime = getPeriodStartTimestamp(Date.now(), period);
  const count = periodToCountMap[period];
  const resolutionTime = periodToResolution[period];
  const [lowerBoundPrice, upperBoundPrice] = pairToBoundPricesMap[pair] || [0, 100];

  return generateChartData(endTime, count, resolutionTime, lowerBoundPrice, upperBoundPrice);
}

function generateChartData(
  endTime: number,
  count: number,
  resolutionTime: number,
  lowerBoundPrice: number,
  upperBoundPrice: number,
): ChartPoint[] {
  const data = [];
  let time = endTime - (count - 1) * resolutionTime;
  let price = getRandomArbitrary(lowerBoundPrice, upperBoundPrice);
  for (; time <= endTime; time += resolutionTime) {
    // price changing -5% => 5%
    price = getRandomArbitrary(price * 0.95, price * 1.05);
    data.push({
      x: time,
      y: price,
    });
  }

  return data;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number): number {
  const value = Math.random() * (max - min) + min;
  return Math.round(value / 1000) * 1000;
}
