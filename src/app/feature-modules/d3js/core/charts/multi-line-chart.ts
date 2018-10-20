import { select, Selection, scaleLinear, ScaleLinear, min, max, line, Line, scaleOrdinal, schemeCategory10, bisector } from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

import { ChartOptions, ChartData, ChartPoint } from '../models';
import { defaultOptions } from '../constants';

export class MultiLineChart {
  // svg native element
  private svgElement: any;
  // svg d3 selection
  private svg: Selection<any, {}, null, undefined>;
  // options
  private options: ChartOptions;
  // data
  private multiData: ChartData[];
  // x scale
  private xScale: ScaleLinear<number, number>;
  // y scale
  private yScale: ScaleLinear<number, number>;
  // d3 color
  private d3Color = scaleOrdinal(schemeCategory10);

  // compute margin
  private getMargin(originMargin: number | number[]) {
    // const originMargin = this.options.margin;
    originMargin = originMargin || 0;
    const margin = typeof originMargin === 'number' ? [originMargin, originMargin, originMargin, originMargin] : originMargin;

    return {
      top: margin[0],
      right: margin[1],
      bottom: margin[2] || margin[0],
      left: margin[3] || margin[1],
    };
  }

  constructor(svgElement: any, options: ChartOptions, multiData: ChartData[]) {
    this.init(svgElement);
    this.update(options, multiData);
  }

  private init(svgElement: any): void {
    this.svgElement = svgElement;
    this.svg = select(svgElement);

    // append element g.charts-container
    this.svg
      .append('g')
      .attr('class', 'charts-container');

    // append element g.focuses-container
    this.svg
      .append('g')
      .attr('class', 'focuses-container');
  }

  update(chartOptions: ChartOptions, multiData: ChartData[]) {
    console.log('[update] MultiLineChart', chartOptions, multiData);
    this.multiData = multiData;
    const options = this.options = Object.assign({}, defaultOptions, chartOptions);
    this.svg
      .attr('width', options.width)
      .attr('height', options.height);

    // compute margin, chartWidth, chartHeight
    const margin = this.getMargin(options.margin);
    const width = +this.svgElement.getBoundingClientRect().width;
    const height = +this.svgElement.getBoundingClientRect().height;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.left - margin.right;

    // select g.chart-container, update position
    const chartsContainer = this.svg.select('g.charts-container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      ;

    /**
     * @see update, enter, exit elements (data-join) https://bl.ocks.org/mbostock/3808218
     */

    // update elements
    let charts = chartsContainer
      .selectAll('path.chart')
      .data(multiData)
      ;

    // compute xScale, yScale from multiData and chart size
    const xScale = this.xScale = getLinearScale(multiData, 'x', chartWidth);
    const yScale = this.yScale = getLinearScale(multiData, 'y', chartHeight, true);

    // generate initial bottom line, ready for first time transition or before remove
    const initChartGenerator = this.initChartGeneratorFactory(xScale, chartHeight);
    // exit element have no new data so we use the first of new data array
    const firstData = multiData[0];
    // transition and remove exit elements
    charts.exit()
      .transition()
      .duration(options.animateDuration)
      .attr('stroke', '#fefefe')
      .attrTween('d', function (d: any) {
        const previous = select(this).attr('d');
        const current = initChartGenerator(firstData || d);
        return interpolatePath(previous, current);
      })
      .remove()
      ;

    // select enter elements and merge with update elements
    // to get whole elements(both current and new elements, from d3 version4)
    charts = charts.enter()
      .append('path')
      .attr('class', 'chart')
      .attr('fill', options.fillColor || 'none')
      .attr('stroke', options.strokeColor)
      .attr('d', initChartGenerator)
      // merge with update elements
      .merge(charts)
      ;

    const chartGenerator = this.chartGeneratorFactory(xScale, yScale);

    charts
      .transition()
      .duration(options.animateDuration)
      .attr('stroke', (d, i) => this.d3Color(i + ''))
      .attrTween('d', function (d) {
        const previous = select(this).attr('d');
        const current = chartGenerator(d);
        return interpolatePath(previous, current);
      })
      ;
  }

  // generate bottom line
  private initChartGeneratorFactory(xScale: ScaleLinear<number, number>, chartHeight: number): Line<ChartPoint> {
    const chartLine = line<ChartPoint>()
      .x((d) => xScale(d.x))
      .y(chartHeight)
      ;

    return chartLine;
  }

  // generate chart
  private chartGeneratorFactory(xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): Line<ChartPoint> {
    const chartLine = line<ChartPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      ;

    return chartLine;
  }

  /**
   * handle svg touch, assume that all chartData have same x values
   * @param touchX touch x position relative to svg
   */
  touch(touchX: number): number {
    const data0 = this.multiData[0];
    const margin = this.getMargin(this.options.margin);

    // @see https://bl.ocks.org/mbostock/3902569
    // compute chart x position circleX from touch position
    // invert value from range -> domain
    const x0 = this.xScale.invert(touchX);
    const bisect = bisector<ChartPoint, any>((d) => d.x).left;
    const i = bisect(data0, x0, 1);
    const d0 = data0[i - 1];
    const d1 = data0[i];
    const touchIndex = d1 && x0 - d0.x > d1.x - x0 ? i : i - 1;
    const circleX = this.xScale(data0[touchIndex].x);

    const focusesContainer = this.svg
      .select('g.focuses-container')
      .style('display', '')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      ;

    let focuses = focusesContainer
      .selectAll('circle.focus')
      .data(this.multiData)
      ;

    focuses.exit().remove();

    focuses = focuses.enter()
      .append('circle')
      .attr('class', 'focus')
      .attr('fill', 'white')
      .attr('stroke', (d, ind) => this.d3Color('' + ind))
      .attr('r', 3)
      .merge(focuses)
      ;

    // update focuses position
    focuses
      .attr('cx', circleX)
      .attr('cy', (data) => this.yScale(data[touchIndex].y))
      ;

    return circleX;
  }

  untouch(): void {
    this.svg
      .select('g.focuses-container')
      .style('display', 'none');
  }
}

// scale linear mapping a value from 'domain' to 'range'
// @see https://github.com/d3/d3-scale
function getLinearScale(
  multiData: ChartData[],
  prop: keyof ChartPoint,
  size: number,
  nice?: boolean
): ScaleLinear<number, number> {
  // set domain from min -> max
  const domain: [number, number] = [
    min(multiData, (data) => min(data, (point) => point[prop])),
    max(multiData, (data) => max(data, (point) => point[prop])),
  ];
  // need to reverse vertical range (y)
  const range = prop === 'y' ? [size, 0] : [0, size];
  const scale = scaleLinear()
    .domain(domain)
    .rangeRound(range);

  return nice ? scale.nice() : scale;
}
