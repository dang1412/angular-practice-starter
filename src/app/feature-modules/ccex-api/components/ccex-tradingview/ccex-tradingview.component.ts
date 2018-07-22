import { Component, OnInit, Input } from '@angular/core';

import { widget, IChartingLibraryWidget } from '../../../../../assets/charting_library/charting_library.min';
import { CcexApiDatafeed } from '../../services/ccex-api.datafeed';

@Component({
  selector: 'app-ccex-tradingview',
  templateUrl: './ccex-tradingview.component.html',
  styleUrls: ['./ccex-tradingview.component.scss'],
  providers: [
    CcexApiDatafeed,
  ]
})
export class CcexTradingViewComponent implements OnInit {
  @Input() symbol: string;
  private widget: IChartingLibraryWidget;

  constructor(private ccexApiDatafeed: CcexApiDatafeed) { }

  ngOnInit() {
    this.widget = (<any>window).tvWidget = new widget({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: this.symbol,
      interval: 'D',
      container_id: 'tv-chart-container',
      datafeed: this.ccexApiDatafeed,
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
