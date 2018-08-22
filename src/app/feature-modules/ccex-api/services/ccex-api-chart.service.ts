import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CandleStick } from 'ccex-api';

import { ChartData, ChartPoint } from '../../../../libs/d3/models';
import { CcexApiService } from './ccex-api.service';
import { map } from 'rxjs/operators';

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
    const [start, end] = getRange(resolution);
    const exchangeApi = this.ccexApiService.getExchange(exchange);
    return exchangeApi.fetchCandleStickRange$(pair, resolution, start, end).pipe(map(candles => candles.map(adaptCandlestick)));
  }
}

function getRange(resolution: ChartPeriodResolution): [number, number] {
  const end = Date.now();
  const timeLength = resolutionLengthMap[resolution] || 60;
  const start = end - timeLength * resolution * 60000;

  return [start, end];
}

function adaptCandlestick(candle: CandleStick): ChartPoint {
  return {
    x: candle.timestamp,
    y: candle.close
  };
}
