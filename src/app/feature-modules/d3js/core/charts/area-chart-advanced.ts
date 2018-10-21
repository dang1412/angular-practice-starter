import { Subject, Observable } from 'rxjs';
import { select, Selection, scaleLinear, ScaleLinear, extent, Area, area, axisBottom, timeFormat, axisRight, bisector } from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

import { ChartOptions, ChartData, ChartPoint } from '../models';
import { defaultOptions } from '../constants';


export class AreaChartAdvanced {
  private svgElement: any;
  private svg: Selection<any, {}, null, undefined>;
  // options
  private options: ChartOptions;
  // data
  private data: ChartData;
  // x scale
  private xScale: ScaleLinear<number, number>;
  // y scale
  private yScale: ScaleLinear<number, number>;
  // output touch X position relative to svg
  private svgTouchX$ = new Subject<{posX: number; point: ChartPoint}>();
  // chart height
  private chartHeight: number;

  private getMargin(originMargin: number | number[]) {
    const margin = typeof originMargin === 'number' ? [originMargin, originMargin, originMargin, originMargin] : originMargin;

    // return {
    //   top: margin[0],
    //   right: margin[1],
    //   bottom: margin[2] || margin[0],
    //   left: margin[3] || margin[1],
    // };

    return {
      top: 22,
      right: 60,
      bottom: 30,
      left: 16
    };
  }

  get touchX$(): Observable<{ posX: number; point: ChartPoint }> {
    return this.svgTouchX$.asObservable();
  }

  constructor(svgElement: any, options: ChartOptions, data: ChartData) {
    this.init(svgElement);
    this.update(options, data);
  }

  private init(svgElement: any): void {
    this.svgElement = svgElement;
    this.svg = select(svgElement);

    // append element g.chart-container
    this.svg
      .append('g')
      .attr('class', 'chart-container')
      ;

    this.svg
      .append('g')
      .attr('class', 'xAxis')
      ;

    this.svg
      .append('g')
      .attr('class', 'yAxis')
      ;

    // append element g.focuses-container
    const focusContainer = this.svg
      .append('g')
      .attr('class', 'focus-container')
      .style('display', 'none');

    focusContainer
      .append('line')
      .attr('class', 'vertical-line')
      .attr('stroke', '#c2e2f4')
      .attr('y1', -2);

    focusContainer
      .append('circle')
      .attr('class', 'focus')
      .attr('r', 3)
      .attr('fill', 'white')
      .attr('stroke', '#c2e2f4')
      ;
  }

  update(chartOptions: ChartOptions, data: ChartData) {
    console.log('[update] AreaChart', chartOptions, data);
    this.data = data;
    const options = this.options = Object.assign({}, defaultOptions, chartOptions);
    this.svg
      .attr('width', options.width)
      .attr('height', options.height);

    // compute chartWidth, chartHeight
    const margin = this.getMargin(options.margin);
    const width = +this.svgElement.getBoundingClientRect().width;
    const height = +this.svgElement.getBoundingClientRect().height;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = this.chartHeight = height - margin.top - margin.bottom;

    // select g.chart-container, update position
    const chartContainer = this.svg.select('g.chart-container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      ;

    // @see update, enter, exit elements (data-join) https://bl.ocks.org/mbostock/3808218
    // update elements
    let chart = chartContainer
      .selectAll('path.chart')
      .data([data])
      ;

    // compute xScale, yScale from multiData and chart size
    const xScale = this.xScale = getLinearScale(data, 'x', chartWidth);
    const yScale = this.yScale = getLinearScale(data, 'y', chartHeight);

    // generate initial bottom line, ready for first time transition
    const initChartGenerator = this.initChartGeneratorFactory(xScale, chartHeight);
    chart = chart.enter()
      .append('path')
      .attr('class', 'chart')
      .attr('fill', options.fillColor || 'none')
      .attr('stroke', options.strokeColor)
      .attr('d', initChartGenerator)
      // merge with update elements
      .merge(chart)
      ;

    const chartGenerator = this.chartGeneratorFactory(xScale, yScale, chartHeight);

    chart
      .transition()
      .duration(options.animateDuration)
      .attrTween('d', function (d) {
        const previous = select(this).attr('d');
        const current = chartGenerator(d);
        return interpolatePath(previous, current);
      });

    // draw axisX
    const xExtent = extent(data, (point) => point.x);
    const gXAxis = this.svg.select('g.xAxis');
    const xAxis = axisBottom(xScale)
      .tickValues(xExtent)
      .tickSize(0)
      .tickFormat(timeFormat(options.timeFormat));

    gXAxis
      .call(xAxis)
      .attr('font-size', '12px')
      .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top + 6) + ')')
      .select('.domain')
      .remove();
    gXAxis
      .selectAll('text')
      .attr('fill', '#c4c4c4')
      ;

    // yAxis
    const yExtent = extent(data, (point) => point.y);
    const gYAxisRight = this.svg.select('g.yAxis');
    const yAxisRight = axisRight(yScale)
      .tickValues(yExtent)
      .tickPadding(0)
      .tickSize(0);
    gYAxisRight
      .call(yAxisRight)
      .attr('font-size', '12px')
      .attr('transform', 'translate(' + (margin.left + chartWidth + 5) + ',' + margin.top + ')')
      .select('.domain')
      .remove();
    gYAxisRight.selectAll('text').attr('fill', '#c4c4c4').attr('dy', 0);
  }

  /**
   * handle svg touch, assume that all chartData have same x values
   * @param touchX touch x position relative to svg
   */
  touch(touchX: number): number {
    const data = this.data;
    const margin = this.getMargin(this.options.margin);

    // @see https://bl.ocks.org/mbostock/3902569
    // compute chart x position circleX from touch position
    // invert value from range -> domain
    const x0 = this.xScale.invert(touchX);
    const bisect = bisector<ChartPoint, any>((d) => d.x).left;
    const i = bisect(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const touchIndex = d1 && x0 - d0.x > d1.x - x0 ? i : i - 1;
    const circleX = this.xScale(data[touchIndex].x);
    const circleY = this.yScale(data[touchIndex].y);

    const focusContainer = this.svg
      .select('g.focus-container')
      .style('display', '')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      ;

    focusContainer
      .select('line.vertical-line')
      .attr('x1', circleX)
      .attr('x2', circleX)
      .attr('y2', this.chartHeight)
      ;
    focusContainer
      .select('circle.focus')
      .attr('cx', circleX)
      .attr('cy', circleY)
      ;

    this.svgTouchX$.next({
      posX: circleX + margin.left,
      point: data[touchIndex]
    });

    return circleX;
  }

  untouch(): void {
    this.svg
      .select('g.focus-container')
      .style('display', 'none');
  }

  // generate bottom line
  private initChartGeneratorFactory(xScale: ScaleLinear<number, number>, chartHeight: number): Area<ChartPoint> {
    const chartArea = area<ChartPoint>()
      .x((d) => xScale(d.x))
      .y(chartHeight)
      ;

    return chartArea;
  }

  // generate chart
  private chartGeneratorFactory(
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    chartHeight: number
  ): Area<ChartPoint> {
    const chartArea = area<ChartPoint>()
      .x((d) => xScale(d.x))
      .y1((d) => yScale(d.y))
      .y0(chartHeight)
      ;

    return chartArea;
  }

}

// scale linear mapping a value from 'domain' to 'range'
// @see https://github.com/d3/d3-scale
function getLinearScale(
  data: ChartData,
  prop: keyof ChartPoint,
  size: number,
): ScaleLinear<number, number> {
  // set domain from min -> max use extent
  const domain: [number, number] = extent(data, (point) => point[prop]);
  // need to reverse vertical range (y)
  const range = prop === 'y' ? [size, 0] : [0, size];
  const scale = scaleLinear()
    .domain(domain)
    .rangeRound(range);

  return scale;
}

