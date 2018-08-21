import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';

import { ChartOptions, ChartData } from '../../../../../libs/d3/models';
import { AreaChart } from '../../../../../libs/d3/charts';

@Component({
  selector: 'app-ccex-chart',
  templateUrl: './ccex-chart.component.html',
  styleUrls: ['./ccex-chart.component.scss']
})

export class CcexChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') svgElement: ElementRef;
  @Input() options: ChartOptions;
  @Input() data: ChartData;
  private chart: AreaChart;

  constructor() { }

  ngOnInit() {
    this.chart = new AreaChart(this.svgElement.nativeElement, this.options, this.data || []);
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.update(this.options, this.data || []);
    }
  }
}
