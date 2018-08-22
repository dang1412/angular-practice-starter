import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { Ticker, Orderbook, Trade } from 'ccex-api/exchanges/exchange-types';
import { ExchangeApi } from 'ccex-api';

import { ChartData, ChartOptions } from '../../../../../libs/d3/models';
import { CcexApiService, CcexApiChartService } from '../../services';
import { withLatestFrom, map, switchMap, filter, startWith, pairwise } from 'rxjs/operators';
import { ChartPeriodResolution } from '../../services/ccex-api-chart.service';

const resolutionTimeFormatMap = {
  [ChartPeriodResolution.hour]: '%H:%M',
  [ChartPeriodResolution.day]: '%H:%M',
  [ChartPeriodResolution.week]: '%m/%d',
  [ChartPeriodResolution.month]: '%m/%d',
};

@Component({
  templateUrl: './ccex-page.component.html',
  styleUrls: ['./ccex-page.component.scss']
})
export class CcexPageComponent implements OnInit, OnDestroy {
  ticker$: Observable<Ticker>;
  // orderbook$: Observable<Orderbook> | any;
  // trade$: Observable<Trade[]> | any;
  chartData$: Observable<ChartData>;
  chartOptions: ChartOptions;

  // pair = 'btc_usdt';
  // exchange = 'binance';
  exchanges = [];
  exchange$ = new ReplaySubject<string>(1);
  pairs = [];
  pair$ = new ReplaySubject<string>(1);

  // tradingview
  symbol$ = new ReplaySubject<string>(1);

  // get symbol(): string {
  //   return `${this.exchange}-${this.pair}`;
  // }

  // get exchangeApi(): ExchangeApi {
  //   return this.ccexApiService.getExchange(this.exchange);
  // }

  constructor(private ccexApiService: CcexApiService, private ccexApiChartService: CcexApiChartService) { }

  ngOnInit() {
    // this.ticker$ = this.exchangeApi.ticker$(this.pair);
    // this.orderbook$ = this.exchangeApi.orderbook$(this.pair);
    // this.trade$ = this.exchangeApi.trade$(this.pair);
    this.exchanges = this.ccexApiService.supportedExchanges;
    this.exchange$.subscribe((exchange) => {
      this.pairs = this.ccexApiService.getExchange(exchange).markets;
      // reset pair select
      this.pair$.next('');
    });

    const pairWithLatestExchange$ = this.pair$.pipe(
      filter((pair) => !!pair),
      withLatestFrom(this.exchange$),
    );

    this.ticker$ = pairWithLatestExchange$.pipe(
      startWith(['', '']),
      pairwise(),
      switchMap(([prev, current]) => {
        console.log('[debug] pairWithLatestExchange', prev, current);
        const [prevPair, prevExchange] = prev;
        if (prevPair && prevExchange) {
          this.ccexApiService.getExchange(prevExchange).stopTicker(prevPair);
        }

        const [pair, exchange] = current;
        return this.ccexApiService.getExchange(exchange).ticker$(pair);
      }));

    this.chartData$ = pairWithLatestExchange$.pipe(switchMap(([pair, exchange]) => {
      return this.ccexApiChartService.getChart$(exchange, pair, ChartPeriodResolution.day);
    }));

    this.chartOptions = {
      animateDuration: 1000,
      height: 300,
      fillColor: '#ffebc5',
      timeFormat: resolutionTimeFormatMap[ChartPeriodResolution.day],
      margin: [30, 0]
    };

    this.selectExchange('bitbank');
    this.selectPair('btc_jpy');
  }

  selectExchange(exchange: string): void {
    this.exchange$.next(exchange);
  }

  selectPair(pair: string): void {
    this.pair$.next(pair);
  }

  ngOnDestroy() {
    // this.exchangeApi.stopTicker(this.pair);
    // this.exchangeApi.stopOrderbook(this.pair);
    // this.exchangeApi.stopLastCandle(this.pair);
  }

}
