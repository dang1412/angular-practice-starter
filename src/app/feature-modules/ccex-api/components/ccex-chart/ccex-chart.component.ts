import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';

// import { ChartOptions, ChartData, ChartPoint } from '../../../../../libs/d3/models';
import { AreaChartAdvanced, ChartOptions, ChartData, ChartPoint } from '../../../d3js/core';

@Component({
  selector: 'app-ccex-chart',
  templateUrl: './ccex-chart.component.html',
  styleUrls: ['./ccex-chart.component.scss']
})

export class CcexChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') svgElement: ElementRef;
  @Input() options: ChartOptions;
  @Input() data: ChartData;

  touchMode = false;
  touchX: number;
  touchPoint: ChartPoint;
  private svgLeft = 0;
  private chart: AreaChartAdvanced;

  press(event) {
    this.changeTouchMode(true);
    const posX = event.center.x - this.svgLeft;
    this.chart.touch(posX);
  }

  pressup(event) {
    this.changeTouchMode(false);
  }

  panmove(event) {
    if (!this.touchMode) {
      return;
    }
    const posX = event.center.x - this.svgLeft;
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

  constructor() { }

  ngOnInit() {
    this.chart = new AreaChartAdvanced(this.svgElement.nativeElement, this.options, this.data || []);
    this.svgLeft = +this.svgElement.nativeElement.getBoundingClientRect().left;
    this.chart.touchX$.subscribe(touchInfo => {
      this.touchX = touchInfo.posX;
      this.touchPoint = touchInfo.point;
    });
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.update(this.options, this.data || []);
    }
  }

  private changeTouchMode(mode: boolean): void {
    this.touchMode = mode;
    if (!mode) {
      this.chart.untouch();
    }
  }

}
