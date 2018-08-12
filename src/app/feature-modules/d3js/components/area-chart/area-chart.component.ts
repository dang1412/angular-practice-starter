
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';

import { ChartOptions, ChartData } from '../../core/models';
import { AreaChart } from '../../core/charts';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss']
})

export class AreaChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') svgElement: ElementRef;
  @Input() options: ChartOptions;
  @Input() multiData: ChartData[];
  private chart: AreaChart;

  constructor() { }

  ngOnInit() {
    this.chart = new AreaChart(this.svgElement.nativeElement, this.options, this.multiData);
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.setOptions(this.options);
      this.chart.setData(this.multiData);
      this.chart.update();
    }
  }

}
