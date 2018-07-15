import { Component, OnInit } from '@angular/core';

import { widget, onready, IChartingLibraryWidget } from '../../../../assets/charting_library/charting_library.min';
import { UDFCompatibleDatafeed } from '../../../../assets/datafeeds/udf/src/udf-compatible-datafeed';

@Component({
  selector: 'app-tradingview',
  templateUrl: './tradingview.component.html',
  styleUrls: ['./tradingview.component.scss']
})
export class TradingviewComponent implements OnInit {
  private widget: IChartingLibraryWidget;

  constructor() { }

  ngOnInit() {
    this.widget = (<any>window).tvWidget = new widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: 'AAPL',
      interval: 'D',
      container_id: 'tv-chart-container',
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      library_path: 'assets/charting_library/',
      locale: 'en',
      // Regression Trend-related functionality is not implemented yet, so it's hidden for a while
      drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id'
    });
  }

}
