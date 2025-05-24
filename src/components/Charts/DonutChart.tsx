import React from 'react';
import { PieChart, PieChartProps } from './PieChart';

export interface DonutChartProps extends Omit<PieChartProps, 'innerRadius'> {
  /**
   * Thickness of the donut as a percentage of the radius (0-1)
   */
  thickness?: number;
  /**
   * Whether to show the total in the center
   */
  showTotal?: boolean;
  /**
   * Custom total formatter
   */
  totalFormatter?: (total: number) => string;
}

/**
 * DonutChart component displays data as a donut chart, which is a pie chart
 * with a hole in the center. It inherits all the customization options and
 * interactive features of the PieChart.
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  thickness = 0.4,
  showTotal = true,
  totalFormatter,
  ...props
}) => {
  // Calculate inner radius based on thickness
  // thickness of 0.4 means the donut takes up 40% of the radius
  const innerRadius = 1 - thickness;
  
  return (
    <PieChart
      {...props}
      innerRadius={innerRadius}
      showTotal={showTotal}
      totalFormatter={totalFormatter}
    />
  );
};

export default DonutChart;
