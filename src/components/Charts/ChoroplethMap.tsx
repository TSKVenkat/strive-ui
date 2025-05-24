import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GeographicMap, GeoFeature } from './GeographicMap';

export interface ChoroplethRegion {
  /**
   * Unique identifier for the region
   */
  id: string;
  /**
   * Name or label for the region
   */
  name: string;
  /**
   * GeoJSON path data for rendering the region
   */
  path: string;
  /**
   * Value associated with the region
   */
  value: number;
  /**
   * Optional custom color for the region
   */
  color?: string;
  /**
   * Optional additional data for the region
   */
  data?: Record<string, any>;
}

export interface ChoroplethMapProps {
  /**
   * Regions with data to render on the map
   */
  regions: ChoroplethRegion[];
  /**
   * Width of the map container
   */
  width?: number | string;
  /**
   * Height of the map container
   */
  height?: number | string;
  /**
   * Whether to show tooltips on hover
   */
  showTooltips?: boolean;
  /**
   * Custom tooltip formatter
   */
  tooltipFormatter?: (region: ChoroplethRegion) => React.ReactNode;
  /**
   * Whether to enable region selection
   */
  selectable?: boolean;
  /**
   * Callback when a region is selected
   */
  onRegionSelect?: (regionId: string) => void;
  /**
   * Whether to enable zooming and panning
   */
  interactive?: boolean;
  /**
   * Initial zoom level (1-10)
   */
  initialZoom?: number;
  /**
   * Initial center coordinates [longitude, latitude]
   */
  initialCenter?: [number, number];
  /**
   * Color scale for the choropleth
   */
  colorScale?: string[];
  /**
   * Value range for color scale [min, max]
   */
  valueRange?: [number, number];
  /**
   * Whether to show a legend
   */
  showLegend?: boolean;
  /**
   * Title for the legend
   */
  legendTitle?: string;
  /**
   * Custom value formatter for legend and tooltips
   */
  valueFormatter?: (value: number) => string;
  /**
   * Whether to normalize values (0-1 scale)
   */
  normalizeValues?: boolean;
  /**
   * Whether to show missing data regions
   */
  showNoDataRegions?: boolean;
  /**
   * Color for regions with no data
   */
  noDataColor?: string;
}

const TooltipContainer = styled(motion.div)`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  pointer-events: none;
  z-index: 10;
  max-width: 250px;
`;

const TooltipHeader = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 4px;
`;

const TooltipContent = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TooltipLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-right: ${({ theme }) => theme.spacing[2]};
`;

const TooltipValue = styled.span``;

/**
 * ChoroplethMap component for visualizing statistical data across geographic regions
 * with color intensity representing values.
 */
export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  regions,
  width = '100%',
  height = 500,
  showTooltips = true,
  tooltipFormatter,
  selectable = true,
  onRegionSelect,
  interactive = true,
  initialZoom = 1,
  initialCenter = [0, 0],
  colorScale = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  valueRange,
  showLegend = true,
  legendTitle = 'Data Values',
  valueFormatter = (value) => value.toLocaleString(),
  normalizeValues = false,
  showNoDataRegions = true,
  noDataColor = '#f0f0f0'
}) => {
  // Convert regions to GeoFeatures for GeographicMap
  const convertRegionsToFeatures = (): GeoFeature[] => {
    return regions.map(region => ({
      id: region.id,
      name: region.name,
      path: region.path,
      value: region.value,
      color: region.color,
      data: region.data
    }));
  };
  
  // Calculate actual value range if not provided
  const calculateValueRange = (): [number, number] => {
    if (valueRange) return valueRange;
    
    const values = regions.map(r => r.value);
    
    if (values.length === 0) return [0, 1];
    
    return [Math.min(...values), Math.max(...values)];
  };
  
  // Format tooltip content
  const formatTooltip = (feature: GeoFeature) => {
    const region = regions.find(r => r.id === feature.id);
    
    if (!region) return null;
    
    if (tooltipFormatter) {
      return tooltipFormatter(region);
    }
    
    return (
      <>
        <TooltipHeader>{region.name}</TooltipHeader>
        <TooltipContent>
          <TooltipRow>
            <TooltipLabel>Value:</TooltipLabel>
            <TooltipValue>{valueFormatter(region.value)}</TooltipValue>
          </TooltipRow>
          {region.data && Object.entries(region.data).map(([key, value]) => (
            <TooltipRow key={key}>
              <TooltipLabel>{key}:</TooltipLabel>
              <TooltipValue>{String(value)}</TooltipValue>
            </TooltipRow>
          ))}
        </TooltipContent>
      </>
    );
  };
  
  // Handle region selection
  const handleRegionSelect = (featureId: string) => {
    if (onRegionSelect) {
      onRegionSelect(featureId);
    }
  };
  
  return (
    <GeographicMap
      features={convertRegionsToFeatures()}
      width={width}
      height={height}
      showTooltips={showTooltips}
      featureTooltipFormatter={formatTooltip}
      selectable={selectable}
      onFeatureSelect={handleRegionSelect}
      interactive={interactive}
      initialZoom={initialZoom}
      initialCenter={initialCenter}
      colorScale={colorScale}
      valueRange={calculateValueRange()}
      showLegend={showLegend}
      valueFormatter={valueFormatter}
    />
  );
};

export default ChoroplethMap;
