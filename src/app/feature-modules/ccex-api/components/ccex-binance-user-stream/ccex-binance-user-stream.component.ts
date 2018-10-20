import { Component, OnInit } from '@angular/core';

import { CcexApiBinanceService } from '../../services/ccex-api-binance.service';
import { keys } from '../../api-keys';

// const crypto = require('crypto');

@Component({
  selector: 'app-ccex-binance-user-stream',
  templateUrl: './ccex-binance-user-stream.component.html',
  styleUrls: ['./ccex-binance-user-stream.component.scss']
})
export class CcexBinanceUserStreamComponent implements OnInit {

  binanceUserStreamAccount$;

  constructor(private ccexApiBinanceService: CcexApiBinanceService) {
    // console.log(crypto);
  }

  ngOnInit() {
    // binance user stream account
    this.binanceUserStreamAccount$ = this.ccexApiBinanceService.fetchUserAccount$();

    // const url = 'https://api.exchangecompare.com/https://api.binance.com/api/v1/userDataStream';
    // const fetchOptions = {
    //   method: 'POST',
    //   headers: {
    //     'X-MBX-APIKEY': keys.binance.key,
    //   },
    // };

    // fetch(url, fetchOptions).then((res) => res.json()).then(data => console.log('fetchData ==>', data));
  }

}
