import { Component, OnInit } from '@angular/core';

import { mockChartData, getRandomArbitrary } from '../../core/helpers';
import { ChartPoint, ChartData, ChartOptions } from '../../core/models';

@Component({
  selector: 'app-d3-page',
  templateUrl: './d3-page.component.html',
  styleUrls: ['./d3-page.component.scss']
})
export class D3PageComponent implements OnInit {
  singleData: ChartData;
  multiData: ChartData[];
  areaOptions: ChartOptions;
  lineOptions: ChartOptions;

  constructor() { }

  ngOnInit() {
    const period = '1hour';
    this.singleData = mockChartData('btc_jpy', period);
    this.generateMultiData(period);
    this.areaOptions = {
      width: 400,
      height: 200,
      animateDuration: 1000,
      fillColor: '#c2e2f4'
    };

    this.lineOptions = {
      width: 400,
      height: 200,
      animateDuration: 1000
    };
  }

  update(period: string) {
    this.singleData = mockChartData('btc_jpy', period);
    this.generateMultiData(period);
  }

  private generateMultiData(period: string): void {
    const number = getRandomArbitrary(1, 4);
    this.multiData = [];
    for (let i = 0; i < number; i++) {
      this.multiData.push(mockChartData('btc_jpy', period));
    }
  }
}
