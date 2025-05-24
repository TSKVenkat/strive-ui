import React from 'react';
import { ScatterPlot, ScatterPlotProps } from './ScatterPlot';

export interface BubbleChartProps extends Omit<ScatterPlotProps, 'pointSizeRange'> {
  /**
   * Bubble size range [min, max] for bubble sizing
   */
  bubbleSizeRange?: [number, number];
  /**
   * Whether to show bubble labels
   */
  showBubbleLabels?: boolean;
}

/**
 * BubbleChart component displays data as bubbles on a two-dimensional chart,
 * with the bubble size representing a third dimension of data.
 * It extends the ScatterPlot with specialized bubble visualization features.
 */
export const BubbleChart: React.FC<BubbleChartProps> = ({
  bubbleSizeRange = [10, 50],
  showBubbleLabels = false,
  ...props
}) => {
  // Custom tooltip formatter that emphasizes the size dimension
  const defaultTooltipFormatter = (x: number, y: number, size: number, label: string, seriesName: string) => {
    return `${label || seriesName}
X: ${x.toLocaleString()}
Y: ${y.toLocaleString()}
Size: ${size.toLocaleString()}`;
  };

  return (
    <ScatterPlot
      {...props}
      pointSizeRange={bubbleSizeRange}
      tooltipFormatter={props.tooltipFormatter || defaultTooltipFormatter}
      showDataLabels={showBubbleLabels}
    />
  );
};

export default BubbleChart;
