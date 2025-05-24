import React from 'react';
import { LineChart, LineChartProps } from './LineChart';

export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {}

/**
 * AreaChart component displays data as an area chart, which is a line chart
 * with the area below the line filled. It inherits all the customization
 * options and interactive features of the LineChart.
 */
export const AreaChart: React.FC<AreaChartProps> = (props) => {
  return (
    <LineChart
      {...props}
      showArea={true}
      areaOpacity={props.areaOpacity || 0.3}
    />
  );
};

export default AreaChart;
