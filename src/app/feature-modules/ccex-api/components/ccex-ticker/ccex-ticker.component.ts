import { Component, OnInit, Input } from '@angular/core';

import { Ticker } from 'ccex-api/exchanges/exchange-types';

@Component({
  selector: 'app-ccex-ticker',
  templateUrl: './ccex-ticker.component.html',
  styleUrls: ['./ccex-ticker.component.scss']
})
export class CcexTickerComponent implements OnInit {
  @Input() ticker: Ticker;

  constructor() { }

  ngOnInit() {
  }

}
