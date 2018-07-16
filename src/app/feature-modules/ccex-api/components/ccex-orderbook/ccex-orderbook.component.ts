import { Component, OnInit, Input } from '@angular/core';

import { Orderbook } from 'ccex-api/exchanges/exchange-types';

@Component({
  selector: 'app-ccex-orderbook',
  templateUrl: './ccex-orderbook.component.html',
  styleUrls: ['./ccex-orderbook.component.scss']
})
export class CcexOrderbookComponent implements OnInit {
  @Input() orderbook: Orderbook;

  constructor() { }

  ngOnInit() {
  }

}
