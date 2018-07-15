import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Ticker, Orderbook } from 'ccex-api/exchanges/exchange-types';
import { BinanceApi } from 'ccex-api/exchanges/binance';

@Component({
  selector: 'app-ccex-page',
  templateUrl: './ccex-page.component.html',
  styleUrls: ['./ccex-page.component.scss']
})
export class CcexPageComponent implements OnInit {
  ticker$: Observable<Ticker>;
  orderbook$: Observable<Orderbook>;

  constructor() { }

  ngOnInit() {
    const binanceApi = new BinanceApi({ corsProxy: 'https://cors-anywhere.herokuapp.com/' });
    this.ticker$ = binanceApi.fetchTicker$('btc_usdt');
    this.orderbook$ = binanceApi.orderbook$('btc_usdt');
  }

}
