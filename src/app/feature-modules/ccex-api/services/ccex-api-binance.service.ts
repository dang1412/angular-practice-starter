import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BinanceUserStream } from 'ccex-api/exchanges/binance/user-stream/binance-user-stream';
// import { BinanceApiPrivateSigned } from 'ccex-api/exchanges/binance/api-private/binance-api-private-signed';
import { BinanceUserStreamAccount } from 'ccex-api/exchanges/binance/user-stream/internal/types';
import { BinanceAccountInformation } from 'ccex-api/exchanges/binance/api-private/internal/types';

import { keys } from '../api-keys';

const corsProxy = 'https://api.exchangecompare.com/';

@Injectable()
export class CcexApiBinanceService {
  private binanceUserStream: BinanceUserStream;
  // private binanceApiPrivateSigned: BinanceApiPrivateSigned;

  constructor() {
    // this.binanceUserStream = new BinanceUserStream(keys.binance.key, corsProxy);
    // this.binanceApiPrivateSigned = new BinanceApiPrivateSigned(keys.binance.key, keys.binance.secret, corsProxy);
  }

  userAccount$(): Observable<BinanceUserStreamAccount> {
    return this.binanceUserStream.userDataAccount$();
  }

  fetchUserAccount$(): Observable<BinanceAccountInformation> {
    // return this.binanceApiPrivateSigned.getAccountInformation();
    return null;
  }
}
