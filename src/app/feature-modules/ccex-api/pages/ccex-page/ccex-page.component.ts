import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { Ticker, Orderbook, Trade } from 'ccex-api/exchanges/exchange-types';

import { ChartData, ChartOptions } from '../../../../../libs/d3/models';
import { CcexApiService, CcexApiChartService } from '../../services';
import { withLatestFrom, map, switchMap, filter, startWith, pairwise, throttleTime } from 'rxjs/operators';
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
  chartResolutions = [
    ChartPeriodResolution.hour,
    ChartPeriodResolution.day,
    ChartPeriodResolution.week,
    ChartPeriodResolution.month,
  ];
  chartResolution$ = new ReplaySubject<ChartPeriodResolution>(1);

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

    // ticker
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

    // d3 chart
    this.chartData$ = combineLatest(pairWithLatestExchange$, this.chartResolution$).pipe(
      switchMap(([[pair, exchange], res]) => this.ccexApiChartService.getChart$(exchange, pair, res).pipe(
        filter(chartData => !!chartData.length),
        throttleTime(10000)
      )),
    );

    this.chartResolution$.subscribe((res) => {
      this.chartOptions = {
        animateDuration: 1000,
        height: 300,
        fillColor: '#ffebc5',
        timeFormat: resolutionTimeFormatMap[res],
        margin: [30, 0]
      };
    });

    // init
    this.selectExchange('bitbank');
    this.selectPair('btc_jpy');
    this.selectChartResolution(ChartPeriodResolution.day);
  }

  selectExchange(exchange: string): void {
    this.exchange$.next(exchange);
  }

  selectPair(pair: string): void {
    this.pair$.next(pair);
  }

  selectChartResolution(res: ChartPeriodResolution): void {
    this.chartResolution$.next(res);
  }

  getResPeriodText(res: ChartPeriodResolution): string {
    switch (res) {
      case ChartPeriodResolution.hour: return 'hour';
      case ChartPeriodResolution.day: return 'day';
      case ChartPeriodResolution.week: return 'week';
      case ChartPeriodResolution.month: return 'month';
    }
  }

  ngOnDestroy() {
    // this.exchangeApi.stopTicker(this.pair);
    // this.exchangeApi.stopOrderbook(this.pair);
    // this.exchangeApi.stopLastCandle(this.pair);
  }

}
