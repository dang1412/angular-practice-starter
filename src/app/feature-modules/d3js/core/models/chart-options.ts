export interface ChartOptions {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  fillColor?: string;
  // top right bottom left
  margin?: number | [number, number, number, number];
  animateDuration?: number;
}
