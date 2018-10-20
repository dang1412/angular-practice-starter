import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { CandleStick } from 'ccex-api';

import { ChartData, ChartPoint } from '../../d3js/core';
import { CcexApiService } from './ccex-api.service';
import { map, scan, catchError } from 'rxjs/operators';

// resolution in minutes
export enum ChartPeriodResolution {
  hour = 1,
  day = 15,
  week = 60,
  month = 240
}

const resolutionLengthMap = {
  [ChartPeriodResolution.hour]: 60,
  [ChartPeriodResolution.day]: 4 * 24,
  [ChartPeriodResolution.week]: 24 * 7,
  [ChartPeriodResolution.month]: 6 * 30,
};

@Injectable()
export class CcexApiChartService {

  constructor(private ccexApiService: CcexApiService) { }

  getChart$(exchange: string, pair: string, resolution: ChartPeriodResolution): Observable<ChartData> {
    const fetchChart$ = this.fetchChart$(exchange, pair, resolution);
    const lastPoint$ = this.lastPoint$(exchange, pair, resolution);

    return concat(fetchChart$, lastPoint$).pipe(
      scan((chartData: ChartData, chartPoint: ChartPoint) => updateChartData(chartData, chartPoint)),
    );
  }

  private lastPoint$(exchange: string, pair: string, resolution: ChartPeriodResolution): Observable<ChartPoint> {
    const exchangeApi = this.ccexApiService.getExchange(exchange);
    return exchangeApi.lastCandle$(pair, null, resolution).pipe(map(adaptCandlestick));
  }

  private fetchChart$(exchange: string, pair: string, resolution: ChartPeriodResolution): Observable<ChartData> {
    const [start, end] = getRange(resolution);
    const exchangeApi = this.ccexApiService.getExchange(exchange);
    return exchangeApi.fetchCandleStickRange$(pair, resolution, start, end).pipe(
      map(candles => candles.map(adaptCandlestick)),
      catchError(e => [])
    );
  }
}

function getRange(resolution: ChartPeriodResolution): [number, number] {
  const end = Date.now();
  const timeLength = resolutionLengthMap[resolution] || 60;
  const start = end - timeLength * resolution * 60000;

  return [start, end];
}

// map candlestick => chart point
function adaptCandlestick(candle: CandleStick): ChartPoint {
  return {
    x: candle.timestamp,
    y: candle.close
  };
}

// update current chart data with new chart point
function updateChartData(chartData: ChartData, point: ChartPoint): ChartData {
  if (!chartData || !chartData.length) {
    return [point];
  }

  chartData = chartData.slice();

  const currentLastPoint = chartData[ chartData.length - 1 ];

  if (!point || point.x < currentLastPoint.x) {
    return chartData;
  }

  if (point.x === currentLastPoint.x) {
    // update currentLastPoint
    currentLastPoint.y = point.y;
    return chartData;
  }

  // remove first point before adding new point
  chartData.shift();
  chartData.push(point);

  return chartData;
}
