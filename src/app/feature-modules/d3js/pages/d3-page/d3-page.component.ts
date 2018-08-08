import { Component, OnInit } from '@angular/core';

import { mockChartData } from '../../core/helpers';
import { ChartPoint, ChartOptions } from '../../core/models';

@Component({
  selector: 'app-d3-page',
  templateUrl: './d3-page.component.html',
  styleUrls: ['./d3-page.component.scss']
})
export class D3PageComponent implements OnInit {
  data: ChartPoint[];
  options: ChartOptions;

  constructor() { }

  ngOnInit() {
    this.data = mockChartData('btc_jpy', '1hour');
    this.options = {
      width: 600,
      height: 400,
      animateDuration: 1000
    };
  }

  update(period: string) {
    this.data = mockChartData('btc_jpy', period);
  }

}
