import { ScaleLinear, area } from 'd3';

import { ChartPoint } from '../models';
import { XYBaseChart } from './base-chart';

export class AreaChart extends XYBaseChart {
  getChartGenerator(xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, chartHeight: number) {
    const chartArea = area<ChartPoint>()
      .x((d) => xScale(d.x))
      .y1((d) => yScale(d.y))
      .y0(chartHeight);

    return chartArea;
  }
}
