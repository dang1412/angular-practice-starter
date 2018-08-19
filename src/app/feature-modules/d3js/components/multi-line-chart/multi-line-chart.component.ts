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
  private touchMode = false;
  private containerLeft = 0;

  constructor() { }

  press(event) {
    this.changeTouchMode(true);
    const posX = event.center.x - this.containerLeft;
    this.chart.touch(posX);
  }

  pressup(event) {
    this.changeTouchMode(false);
  }

  panmove(event) {
    if (!this.touchMode) {
      return;
    }
    const posX = event.center.x - this.containerLeft;
    this.chart.touch(posX);
  }

  panstart(event) {
    if (!this.touchMode) {
      return;
    }
  }

  panend(event) {
    if (!this.touchMode) {
      return;
    }
    this.changeTouchMode(false);
  }

  ngOnInit() {
    this.chart = new MultiLineChart(this.svgElement.nativeElement, this.options, this.multiData);
    // calculate container (svg) left position
    this.containerLeft = +this.svgElement.nativeElement.getBoundingClientRect().left;
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.update(this.options, this.multiData);
    }
  }

  private changeTouchMode(mode: boolean): void {
    this.touchMode = mode;
    if (!mode) {
      this.chart.untouch();
    }
  }

}
