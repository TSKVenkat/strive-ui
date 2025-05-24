import React from 'react';
import styled from 'styled-components';
import { GaugeChart, GaugeChartProps } from './GaugeChart';

export interface SpeedometerChartProps extends Omit<GaugeChartProps, 'startAngle' | 'endAngle'> {
  /**
   * Whether to show the needle
   */
  showNeedle?: boolean;
  /**
   * Needle color
   */
  needleColor?: string;
  /**
   * Whether to show a center knob
   */
  showKnob?: boolean;
  /**
   * Knob color
   */
  knobColor?: string;
  /**
   * Whether to show speed units
   */
  showUnits?: boolean;
  /**
   * Speed units (e.g., 'mph', 'km/h')
   */
  units?: string;
}

// Styled components
const SpeedNeedle = styled.line`
  stroke: ${({ color }) => color};
  stroke-width: 2;
  stroke-linecap: round;
`;

const SpeedKnob = styled.circle`
  fill: ${({ color }) => color};
  stroke: ${({ theme }) => theme.colors.neutral[300]};
  stroke-width: 1;
`;

const UnitsLabel = styled.div`
  position: absolute;
  bottom: 15%;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  text-align: center;
`;

/**
 * SpeedometerChart component displays a value as a speedometer with a needle,
 * extending the GaugeChart with speedometer-specific features.
 */
export const SpeedometerChart: React.FC<SpeedometerChartProps> = ({
  showNeedle = true,
  needleColor = '#e53935',
  showKnob = true,
  knobColor = '#f5f5f5',
  showUnits = true,
  units = 'mph',
  ...props
}) => {
  // Custom renderer to add needle and knob
  const renderSpeedometer = (originalRender: () => React.ReactNode) => {
    return (
      <>
        {originalRender()}
        
        {/* Add units below the value */}
        {showUnits && units && (
          <UnitsLabel>
            {units}
          </UnitsLabel>
        )}
      </>
    );
  };
  
  // Extend the GaugeChart with speedometer-specific configuration
  return (
    <GaugeChart
      {...props}
      startAngle={-150}  // Wider angle for speedometer look
      endAngle={150}
      thickness={0.1}    // Thinner arc for speedometer
      majorTicks={10}    // More ticks for speedometer
      minorTicks={1}
      showTicks={true}
      showTickLabels={true}
      animate={true}
    >
      {renderSpeedometer}
    </GaugeChart>
  );
};

export default SpeedometerChart;
