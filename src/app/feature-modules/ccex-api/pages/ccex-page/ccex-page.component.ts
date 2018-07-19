import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Ticker, Orderbook, Trade } from 'ccex-api/exchanges/exchange-types';
import { ExchangeApi } from 'ccex-api';
import { CcexApiService } from '../../services';

@Component({
  selector: 'app-ccex-page',
  templateUrl: './ccex-page.component.html',
  styleUrls: ['./ccex-page.component.scss']
})
export class CcexPageComponent implements OnInit, OnDestroy {
  ticker$: Observable<Ticker> | any;
  orderbook$: Observable<Orderbook> | any;
  trade$: Observable<Trade[]> | any;

  pair = 'btc_usd';
  exchange = 'bitfinex';

  get exchangeApi(): ExchangeApi {
    return this.ccexApiService.getExchange(this.exchange);
  }

  constructor(private ccexApiService: CcexApiService) { }

  ngOnInit() {
    this.ticker$ = this.exchangeApi.ticker$(this.pair);
    this.orderbook$ = this.exchangeApi.orderbook$(this.pair);
  }

  ngOnDestroy() {
    // this.exchangeApi.stopTicker(this.pair);
    this.exchangeApi.stopOrderbook(this.pair);
  }

}
