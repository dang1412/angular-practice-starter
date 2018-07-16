import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Ticker, Orderbook } from 'ccex-api/exchanges/exchange-types';
import { BitfinexApi } from 'ccex-api/exchanges/bitfinex';

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
    const bitfinexApi = new BitfinexApi();
    this.ticker$ = bitfinexApi.ticker$('btc_usd');
    this.orderbook$ = bitfinexApi.orderbook$('btc_usd');
  }

}
