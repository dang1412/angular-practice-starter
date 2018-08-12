import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';

import { ChartOptions, ChartData } from '../../core/models';
import { MultiLineChart } from '../../core/charts';

@Component({
  selector: 'app-multi-line-chart',
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.scss']
})
export class MultiLineChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') svgElement: ElementRef;
  @Input() options: ChartOptions;
  @Input() multiData: ChartData[];
  private chart: MultiLineChart;

  constructor() { }

  ngOnInit() {
    this.chart = new MultiLineChart(this.svgElement.nativeElement, this.options, this.multiData);
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.setOptions(this.options);
      this.chart.setData(this.multiData);
      this.chart.update();
    }
  }

}
