import { ScaleLinear, line } from 'd3';

import { ChartPoint } from '../models';
import { XYBaseChart } from './base-chart';

export class MultiLineChart extends XYBaseChart {
  getChartGenerator(xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, chartHeight: number) {
    const chartLine = line<ChartPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      ;

    return chartLine;
  }
}
