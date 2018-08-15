import { select, Selection, extent, scaleLinear, ScaleLinear, min, max } from 'd3';
import { interpolatePath } from 'd3-interpolate-path';

import { ChartOptions, ChartData, ChartPoint } from '../models';
import { defaultOptions } from '../constants';

export abstract class XYBaseChart {
  svgElement: any;
  svg: Selection<any, {}, null, undefined>;
  options: ChartOptions;
  multiData: ChartData[];

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

  constructor(svgElement: any, options: ChartOptions, multiData: ChartData[]) {
    this.svgElement = svgElement;
    this.svg = select(svgElement);
    this.init(options, multiData);
  }

  private init(options: ChartOptions, multiData: ChartData[]): void {
    // append element g.charts-container for the first time
    this.svg
      .append('g')
      .attr('class', 'charts-container');

    this.setOptions(options);
    this.setData(multiData);
    this.update();
  }

  setOptions(options: ChartOptions) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  setData(multiData: ChartData[]) {
    this.multiData = multiData;
  }

  update() {
    console.log('[update]', this.options, this.multiData);
    const options = this.options;
    this.svg
      .attr('width', options.width)
      .attr('height', options.height);

    // compute chartWidth, chartHeight
    const margin = this.margin;
    const width = +this.svgElement.getBoundingClientRect().width;
    const height = +this.svgElement.getBoundingClientRect().height;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.left - margin.right;

    // select g.chart-container, update position
    const chartsContainer = this.svg.select('g.charts-container')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      ;

    // @see update, enter, exit elements (data-join) https://bl.ocks.org/mbostock/3808218
    // update elements
    let charts = chartsContainer
      .selectAll('path.chart')
      .data(this.multiData)
      ;

    // remove exit elements
    charts.exit()
      .remove()
      ;

    // select enter elements and merge with update elements
    charts = charts.enter()
      .append('path')
      .attr('class', 'chart')
      .attr('fill', options.fillColor || 'none')
      .attr('stroke', options.strokeColor)
      // merge with update elements
      .merge(charts)
      ;

    // compute xScale, yScale from multiData and chart size
    const xScale = getLinearScale(this.multiData, 'x', chartWidth, false);
    const yScale = getLinearScale(this.multiData, 'y', chartHeight, true, true);

    const chartGenerator = this.getChartGenerator(this.multiData, xScale, yScale, chartHeight);

    charts
      .transition()
      .duration(options.animateDuration)
      .attrTween('d', function (d) {
        const previous = select(this).attr('d');
        const current = chartGenerator(d);
        return interpolatePath(previous, current);
      });
  }

  protected abstract getChartGenerator(
    multiData: ChartData[],
    xScale: ScaleLinear<number, number>,
    yScale: ScaleLinear<number, number>,
    chartHeight: number
  );
}

// scale linear mapping a value from 'domain' to 'range'
// @see https://github.com/d3/d3-scale
function getLinearScale(
  multiData: ChartData[],
  prop: keyof ChartPoint,
  size: number,
  reverseRange: boolean,
  nice?: boolean
): ScaleLinear<number, number> {
  // set domain from min -> max
  const domain: [number, number] = [
    min(multiData, (data) => min(data, (point) => point[prop])),
    max(multiData, (data) => max(data, (point) => point[prop])),
  ];
  // need to reverse scale with vertical range (y)
  const range = reverseRange ? [size, 0] : [0, size];
  const scale = scaleLinear()
    .domain(domain)
    .rangeRound(range);

  return nice ? scale.nice() : scale;
}
