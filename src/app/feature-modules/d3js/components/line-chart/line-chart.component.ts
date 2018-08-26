import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { select, Selection, extent, scaleLinear, ScaleLinear, line, color, area } from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

import { ChartOptions, ChartPoint } from '../../core/models';
import { defaultOptions } from '../../core/constants';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') svgElement: ElementRef;
  @Input() options: ChartOptions;
  @Input() data: ChartPoint[];

  private initialized = false;
  private chartWidth: number;
  private chartHeight: number;
  private xScale: ScaleLinear<number, number>;
  private yScale: ScaleLinear<number, number>;

  // svgElement d3 selection
  get svg(): Selection<any, {}, null, undefined> {
    return select(this.svgElement.nativeElement);
  }

  get margin() {
    const originMargin = this.options.margin;
    const margin = typeof originMargin === 'number' ? [originMargin, originMargin, originMargin, originMargin] : originMargin;

    return {
      top: margin[0],
      right: margin[1],
      bottom: margin[2] || margin[0],
      left: margin[3] || margin[1],
    };
  }

  constructor() { }

  ngOnInit() {
    this.initialized = true;
    this.prepareChart();
    this.init();
    this.update();
  }

  ngOnChanges() {
    this.options = Object.assign({}, defaultOptions, this.options);
    if (!this.initialized) {
      return;
    }

    // calculate xScale, yScale, chartHeight
    this.prepareChart();
    this.update();
  }

  interupt() {
    console.log('interupt');
    this.svg.select('g.chart path').interrupt();
  }

  private init() {
    const options = this.options;
    const margin = this.margin;
    const data = this.data;

    // chart
    const gChart = this.svg
      .append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const baseLine = area<ChartPoint>()
      .x((d) => this.xScale(d.x))
      .y1(this.chartHeight)
      .y0(this.chartHeight)
      ;

    // draw baseline for the first animation
    gChart
      .append('path')
      .datum(data)
      .attr('d', baseLine);
  }

  private update() {
    const options = this.options;
    const margin = this.margin;
    const data = this.data;

    const chartLine = area<ChartPoint>()
      .x((d) => this.xScale(d.x))
      .y1((d) => this.yScale(d.y))
      .y0(this.chartHeight);

    const gChart = this.svg.select('g.chart').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    const path = gChart.select('path');

    path
      .datum(data)
      .transition()
      .duration(options.animateDuration)
      .attr('stroke', color(options.strokeColor) + '')
      .attr('fill', options.fillColor ? color(options.fillColor) + '' : 'none')
      .attrTween('d', (d) => {
        const previous = path.attr('d');
        const current = chartLine(d);
        return interpolatePath(previous, current);
      })
      .on('end', () => {
        console.log('[debug] animation end');
      });
  }

  // calculate chartWidth, chartHeight, xScale, yScale
  private prepareChart() {
    const options = this.options;
    this.svg
      .attr('width', options.width)
      .attr('height', options.height);

    // calculate chartWidth, chartHeight
    const margin = this.margin;
    const width = +this.svgElement.nativeElement.getBoundingClientRect().width;
    const height = +this.svgElement.nativeElement.getBoundingClientRect().height;
    const chartWidth = this.chartWidth = width - margin.left - margin.right;
    const chartHeight = this.chartHeight = height - margin.left - margin.right;

    const data = this.data;

    // calculate xScale
    const xExtent = extent(data, (point) => point.x);
    this.xScale = getLinearScale(xExtent, chartWidth, false);

    // calculate yScale
    const yExtent = extent(data, (point) => point.y);
    this.yScale = getLinearScale(yExtent, chartHeight, true, true);

    console.log(data, xExtent, yExtent);
  }

}

// scale linear mapping a value from 'domain' to 'range'
// @see https://github.com/d3/d3-scale
function getLinearScale(domain: [number, number], size: number, reverse: boolean, nice?: boolean): ScaleLinear<number, number> {
  // need to reverse scale with vertical range (y)
  const range = reverse ? [size, 0] : [0, size];
  const scale = scaleLinear()
    .domain(domain)
    .rangeRound(range);

  return nice ? scale.nice() : scale;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min: number, max: number): number {
  const value = Math.random() * (max - min) + min;
  return Math.round(value);
}

