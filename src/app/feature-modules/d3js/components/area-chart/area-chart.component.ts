
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
  @Input() data: ChartData;
  private chart: AreaChart;

  constructor() { }

  ngOnInit() {
    this.chart = new AreaChart(this.svgElement.nativeElement, this.options, this.data);
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.update(this.options, this.data);
    }
  }

}
