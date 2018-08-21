import { Injectable } from '@angular/core';

import { BinanceApi, BitbankApi, BitfinexApi, CoinbaseApi, ExchangeApi } from 'ccex-api';

const corsProxy = 'https://api.exchangecompare.com/';

@Injectable()
export class CcexApiService {
  private exchangeServices: { [exchange: string]: ExchangeApi } = {};

  get supportedExchanges(): string[] {
    return [
      'binance',
      'bitbank',
      'bitfinex',
      'coinbase',
    ];
  }

  getExchange(exchange: string): ExchangeApi {
    if (!this.exchangeServices[exchange]) {
      this.exchangeServices[exchange] = exchangeInstance(exchange);
    }

    return this.exchangeServices[exchange];
  }
}

// create exchange instance
function exchangeInstance(exchange: string): ExchangeApi {
  if (exchange === 'binance') {
    return new BinanceApi({ corsProxy });
  }
  if (exchange === 'bitbank') {
    return new BitbankApi();
  }
  if (exchange === 'bitfinex') {
    return new BitfinexApi();
  }
  if (exchange === 'coinbase') {
    return new CoinbaseApi({ corsProxy });
  }

  throw new Error(`Exchange ${exchange} is not supported`);
}
