// import { ScaleLinear, area, stack } from 'd3';

// import { ChartPoint, ChartData } from '../models';
// import { XYBaseChart } from './base-chart';

// draw multiple stacked area chart, assume that all charts have the same x values
// export class AreaChart extends XYBaseChart {
//   getChartGenerator(
//     multiData: ChartData[], xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, chartHeight: number) {
//     const chartNumber = multiData.length;
//     const firstChart = multiData[0];
//     const chartLength = firstChart.length;
//     const stackData = [];
//     const keys = [];

//     for (let i = 0; i < chartLength; i++) {
//       const object: {[prop: string]: number} = { x: firstChart[i].x };
//       for (let j = 0; j < chartNumber; j ++) {
//         const chartData = multiData[j];
//         object['y' + j] = chartData[i].y;
//         if (i === 0) {
//           keys.push('y' + j);
//         }
//       }

//       stackData.push(object);
//     }

//     /**
//      * stackData
//      * [
//      *  {x: '', y0: '', y1: ''},
//      *  {x: '', y0: '', y1: ''},
//      * ]
//      */

//     const d3Stack = stack()
//       .keys(keys);

//     const series = d3Stack(stackData);
//     console.log('==> series', series, keys);

//     // recompute yScale domain
//     // const yDomain =

//     const chartArea = area<ChartPoint>()
//       .x((d) => xScale(d.x))
//       .y1((d) => yScale(d.y))
//       .y0(chartHeight);

//     return chartArea;
//   }
// }

import { select, Selection, scaleLinear, ScaleLinear, extent, Area, area, axisBottom, timeFormat, axisRight } from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

import { ChartOptions, ChartData, ChartPoint } from '../models';
import { defaultOptions } from '../constants';

export class AreaChart {
  private svgElement: any;
  private svg: Selection<any, {}, null, undefined>;
  // private options: ChartOptions;
  // private data: ChartData;

  private getMargin(originMargin: number | number[]) {
    const margin = typeof originMargin === 'number' ? [originMargin, originMargin, originMargin, originMargin] : originMargin;

    return {
      top: margin[0],
      right: margin[1],
      bottom: margin[2] || margin[0],
      left: margin[3] || margin[1],
    };
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
  }

  update(chartOptions: ChartOptions, data: ChartData) {
    console.log('[update] AreaChart', chartOptions, data);
    const options = Object.assign({}, defaultOptions, chartOptions);
    this.svg
      .attr('width', options.width)
      .attr('height', options.height);

    // compute chartWidth, chartHeight
    const margin = this.getMargin(options.margin);
    const width = +this.svgElement.getBoundingClientRect().width;
    const height = +this.svgElement.getBoundingClientRect().height;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

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
    const xScale = getLinearScale(data, 'x', chartWidth);
    const yScale = getLinearScale(data, 'y', chartHeight, true);

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

    const textAnchorAttrs = ['start', 'end'];
    gXAxis
      .call(xAxis)
      .attr('font-size', '12px')
      .attr('transform', 'translate(' + margin.left + ',' + (chartHeight + margin.top + 6) + ')')
      .select('.domain')
      .remove();
    gXAxis
      .selectAll('text')
      .attr('fill', '#c4c4c4')
      .attr('text-anchor', (d, i) => textAnchorAttrs[i]);

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
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .select('.domain')
      .remove();
    gYAxisRight.selectAll('text').attr('fill', '#c4c4c4').attr('dy', 0);
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
  nice?: boolean
): ScaleLinear<number, number> {
  // set domain from min -> max use extent
  const domain: [number, number] = extent(data, (point) => point[prop]);
  // need to reverse vertical range (y)
  const range = prop === 'y' ? [size, 0] : [0, size];
  const scale = scaleLinear()
    .domain(domain)
    .rangeRound(range);

  return nice ? scale.nice() : scale;
}

