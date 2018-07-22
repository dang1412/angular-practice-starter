import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CandleStick } from 'ccex-api/exchanges/exchange-types';

import {
  IBasicDataFeed,
  SearchSymbolsCallback,
  ResolveCallback,
  ErrorCallback,
  LibrarySymbolInfo,
  ResolutionString,
  HistoryCallback,
  SubscribeBarsCallback,
  OnReadyCallback,
  Bar,
} from '../../../../assets/charting_library/charting_library.min';

import { CcexApiService } from './ccex-api.service';

const supportedResolutions = ['1', '5', '30', '15', '60', '240', '480', '720', 'D', 'W', 'M'];

@Injectable()
export class CcexApiDatafeed implements IBasicDataFeed {
  private initialLastCandle: CandleStick;
  private unsubscribeBarSubject$ = new Subject();

  constructor(private ccexApiService: CcexApiService) { }

  onReady(callback: OnReadyCallback): void {
    setTimeout(callback);
  }

  // Not used yet
  searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void { }

  // Symbol format {exchange}-{pair}, ex: 'btfinex-btc_usd'
  resolveSymbol(symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void {
    const [exchange, pair] = symbolName.split('-');
    const pricescale = 10 ** getPriceDigit(pair);
    console.log('[ccex-api] pricescale', pricescale);
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      exchange: exchange.toUpperCase(),
      listed_exchange: exchange.toUpperCase(),
      // 'exchange-traded': symbolName,
      // 'exchange-listed': exchangePair.exchange.toUpperCase(),
      timezone: <TradingView.Timezone>'Asia/Tokyo',
      minmov: 1,
      // minmov2: 0,
      pricescale,
      // pointvalue: 1,
      session: '24x7',
      has_intraday: true,
      has_no_volume: false,
      ticker: symbolName,
      description: pair.replace('_', '/').toUpperCase(),
      type: 'bitcoin',
      supported_resolutions: supportedResolutions,
    };

    setTimeout(onResolve(symbolInfo));
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: HistoryCallback,
    onError: ErrorCallback,
    isFirstCall: boolean
  ): void {
    const [exchange, pair] = symbolInfo.name.split('-');
    const minutesFoot = resolutionToMinutes(resolution);

    // reset initialLastCandle at first call
    if (isFirstCall) {
      this.initialLastCandle = null;
    }

    this.ccexApiService.getExchange(exchange)
      .fetchCandleStickRange$(pair, minutesFoot, rangeStartDate * 1000, rangeEndDate * 1000)
      .subscribe((candlesticks) => {
        console.log('[ccex-tradingview] got candlesticks', candlesticks);
        // update initialLastCandle, used in 'subscribeBars'
        if (isFirstCall && candlesticks && candlesticks.length) {
          this.initialLastCandle = candlesticks[candlesticks.length - 1];
        }
        const bars = candlesticks.map(adaptCandlestickToBar);
        const noData = isFirstCall || (bars && bars.length > 0) ? false : true;
        onResult(bars, { noData });
      });
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ): void {
    console.log('[ccex-tradingview] subscribeBars', symbolInfo.name, listenerGuid, this.initialLastCandle);
    const [exchange, pair] = symbolInfo.name.split('-');
    const minutesFoot = resolutionToMinutes(resolution);
    this.ccexApiService.getExchange(exchange).lastCandle$(pair, this.initialLastCandle, minutesFoot)
      .pipe(takeUntil(this.unsubscribeBarSubject$))
      .subscribe((lastCandle) => {
        console.log('[ccex-tradingview] realtime candle', lastCandle);
        const updatedLastBar = adaptCandlestickToBar(lastCandle);
        onTick(updatedLastBar);
      });
  }

  unsubscribeBars(listenerGuid: string): void {
    console.log('[ccex-tradingview] unsubscribeBars', listenerGuid);
    this.unsubscribeBarSubject$.next();
  }
  // subscribeDepth?(symbolInfo: LibrarySymbolInfo, callback: DomeCallback): string;
  // unsubscribeDepth?(subscriberUID: string): void;
}

const pairOrQuoteAssetPriceDigits = {
  'xrp_jpy': 3,
  'btc': 8,
  'eth': 8,
  'jpy': 0,
  'usd': 2,
  'usdt': 2,
};

// get priceScale from pair
function getPriceDigit(pair: string): number {
  if (pairOrQuoteAssetPriceDigits[pair]) {
    return pairOrQuoteAssetPriceDigits[pair];
  }

  const quoteAsset = pair.split('_')[1] || '';
  return pairOrQuoteAssetPriceDigits[quoteAsset] || 0;
}

// get minutesFoot from Tradingview resolution
function resolutionToMinutes(res: ResolutionString): number {
  const resStringMinuteMap = {
    'D': 1440,
  };

  const minutes = resStringMinuteMap[res] || Number(res);
  if (!minutes) {
    throw new Error('Resolution is not recognized ' + res);
  }

  return minutes;
}

// adapt ccex-api CandleStick type to tradingview Bar type
function adaptCandlestickToBar(candlestick: CandleStick): Bar {
  return Object.assign({}, candlestick, { time: candlestick.timestamp});
}
