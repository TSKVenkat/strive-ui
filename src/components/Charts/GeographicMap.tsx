import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface GeoFeature {
  /**
   * Unique identifier for the feature
   */
  id: string;
  /**
   * Name or label for the feature
   */
  name: string;
  /**
   * GeoJSON path data for rendering the feature
   */
  path: string;
  /**
   * Optional value associated with the feature (for choropleth maps)
   */
  value?: number;
  /**
   * Optional custom color for the feature
   */
  color?: string;
  /**
   * Optional additional data for the feature
   */
  data?: Record<string, any>;
}

export interface MapMarker {
  /**
   * Unique identifier for the marker
   */
  id: string;
  /**
   * Name or label for the marker
   */
  name: string;
  /**
   * Latitude coordinate
   */
  latitude: number;
  /**
   * Longitude coordinate
   */
  longitude: number;
  /**
   * Optional value associated with the marker (for sizing)
   */
  value?: number;
  /**
   * Optional custom color for the marker
   */
  color?: string;
  /**
   * Optional icon URL for the marker
   */
  icon?: string;
  /**
   * Optional additional data for the marker
   */
  data?: Record<string, any>;
}

export interface GeographicMapProps {
  /**
   * GeoJSON features to render
   */
  features: GeoFeature[];
  /**
   * Optional markers to display on the map
   */
  markers?: MapMarker[];
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
   * Custom tooltip formatter for features
   */
  featureTooltipFormatter?: (feature: GeoFeature) => React.ReactNode;
  /**
   * Custom tooltip formatter for markers
   */
  markerTooltipFormatter?: (marker: MapMarker) => React.ReactNode;
  /**
   * Whether to enable feature selection
   */
  selectable?: boolean;
  /**
   * Callback when a feature is selected
   */
  onFeatureSelect?: (featureId: string) => void;
  /**
   * Callback when a marker is selected
   */
  onMarkerSelect?: (markerId: string) => void;
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
   * Color scale for choropleth maps
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
   * Custom value formatter for legend
   */
  valueFormatter?: (value: number) => string;
}

const MapContainer = styled.div<{ $width: number | string; $height: number | string }>`
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MapSvg = styled.svg`
  width: 100%;
  height: 100%;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const MapFeature = styled(motion.path)<{ $interactive: boolean; $selected: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  stroke: ${({ theme }) => theme.colors.neutral[300]};
  stroke-width: ${({ $selected }) => $selected ? 2 : 0.5};
  
  &:hover {
    opacity: 0.8;
  }
`;

const MapMarkerCircle = styled(motion.circle)<{ $interactive: boolean; $selected: boolean }>`
  cursor: ${({ $interactive }) => $interactive ? 'pointer' : 'default'};
  stroke: ${({ theme, $selected }) => $selected ? theme.colors.primary.main : theme.colors.common.white};
  stroke-width: ${({ $selected }) => $selected ? 2 : 1};
  
  &:hover {
    opacity: 0.8;
  }
`;

const MapMarkerIcon = styled.image`
  pointer-events: none;
`;

const MapMarkerLabel = styled.text`
  font-size: 10px;
  fill: ${({ theme }) => theme.colors.neutral[800]};
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ZoomControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 5px;
`;

const ZoomButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.common.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &:active {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
`;

const Legend = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 10px;
  max-width: 200px;
`;

const LegendTitle = styled.div`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const LegendGradient = styled.div`
  height: 20px;
  width: 100%;
  margin-bottom: 5px;
  position: relative;
`;

const LegendLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

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
 * GeographicMap component for rendering interactive maps with features and markers.
 */
export const GeographicMap: React.FC<GeographicMapProps> = ({
  features,
  markers = [],
  width = '100%',
  height = 500,
  showTooltips = true,
  featureTooltipFormatter,
  markerTooltipFormatter,
  selectable = true,
  onFeatureSelect,
  onMarkerSelect,
  interactive = true,
  initialZoom = 1,
  initialCenter = [0, 0],
  colorScale = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  valueRange,
  showLegend = true,
  valueFormatter = (value) => value.toLocaleString()
}) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Calculate actual value range if not provided
  const actualValueRange = valueRange || (() => {
    const values = features
      .filter(f => f.value !== undefined)
      .map(f => f.value as number);
    
    if (values.length === 0) return [0, 1];
    
    return [Math.min(...values), Math.max(...values)];
  })();
  
  // Get color for a feature based on its value
  const getFeatureColor = (feature: GeoFeature) => {
    if (feature.color) return feature.color;
    
    if (feature.value === undefined) return colorScale[0];
    
    const [min, max] = actualValueRange;
    const range = max - min;
    
    if (range === 0) return colorScale[Math.floor(colorScale.length / 2)];
    
    const normalizedValue = (feature.value - min) / range;
    const colorIndex = Math.min(
      Math.floor(normalizedValue * colorScale.length),
      colorScale.length - 1
    );
    
    return colorScale[colorIndex];
  };
  
  // Get color for a marker
  const getMarkerColor = (marker: MapMarker) => {
    if (marker.color) return marker.color;
    return '#f44336'; // Default red
  };
  
  // Get size for a marker based on its value
  const getMarkerSize = (marker: MapMarker) => {
    const baseSize = 5;
    
    if (marker.value === undefined) return baseSize;
    
    const [min, max] = actualValueRange;
    const range = max - min;
    
    if (range === 0) return baseSize * 1.5;
    
    const normalizedValue = (marker.value - min) / range;
    return baseSize + normalizedValue * 10;
  };
  
  // Convert geo coordinates to SVG coordinates
  const geoToSvgCoords = (lon: number, lat: number): [number, number] => {
    if (!svgRef.current) return [0, 0];
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    
    // Simple equirectangular projection
    const x = (lon + 180) * (svgWidth / 360);
    const y = (90 - lat) * (svgHeight / 180);
    
    return [x, y];
  };
  
  // Handle feature click
  const handleFeatureClick = (featureId: string) => {
    if (!selectable) return;
    
    setSelectedFeature(prev => prev === featureId ? null : featureId);
    
    if (onFeatureSelect) {
      onFeatureSelect(featureId);
    }
  };
  
  // Handle marker click
  const handleMarkerClick = (markerId: string) => {
    if (!selectable) return;
    
    setSelectedMarker(prev => prev === markerId ? null : markerId);
    
    if (onMarkerSelect) {
      onMarkerSelect(markerId);
    }
  };
  
  // Handle feature hover
  const handleFeatureHover = (event: React.MouseEvent, feature: GeoFeature) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
      content: formatFeatureTooltip(feature)
    });
  };
  
  // Handle marker hover
  const handleMarkerHover = (event: React.MouseEvent, marker: MapMarker) => {
    if (!showTooltips) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    setTooltipData({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
      content: formatMarkerTooltip(marker)
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setTooltipData(null);
  };
  
  // Format feature tooltip
  const formatFeatureTooltip = (feature: GeoFeature) => {
    if (featureTooltipFormatter) {
      return featureTooltipFormatter(feature);
    }
    
    return (
      <>
        <TooltipHeader>{feature.name}</TooltipHeader>
        {feature.value !== undefined && (
          <TooltipContent>
            <TooltipRow>
              <TooltipLabel>Value:</TooltipLabel>
              <TooltipValue>{valueFormatter(feature.value)}</TooltipValue>
            </TooltipRow>
          </TooltipContent>
        )}
        {feature.data && (
          <TooltipContent>
            {Object.entries(feature.data).map(([key, value]) => (
              <TooltipRow key={key}>
                <TooltipLabel>{key}:</TooltipLabel>
                <TooltipValue>{String(value)}</TooltipValue>
              </TooltipRow>
            ))}
          </TooltipContent>
        )}
      </>
    );
  };
  
  // Format marker tooltip
  const formatMarkerTooltip = (marker: MapMarker) => {
    if (markerTooltipFormatter) {
      return markerTooltipFormatter(marker);
    }
    
    return (
      <>
        <TooltipHeader>{marker.name}</TooltipHeader>
        {marker.value !== undefined && (
          <TooltipContent>
            <TooltipRow>
              <TooltipLabel>Value:</TooltipLabel>
              <TooltipValue>{valueFormatter(marker.value)}</TooltipValue>
            </TooltipRow>
          </TooltipContent>
        )}
        {marker.data && (
          <TooltipContent>
            {Object.entries(marker.data).map(([key, value]) => (
              <TooltipRow key={key}>
                <TooltipLabel>{key}:</TooltipLabel>
                <TooltipValue>{String(value)}</TooltipValue>
              </TooltipRow>
            ))}
          </TooltipContent>
        )}
      </>
    );
  };
  
  // Handle zoom in
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 10));
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  };
  
  // Handle mouse down for dragging
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!interactive) return;
    
    setIsDragging(true);
    setDragStart([event.clientX, event.clientY]);
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive || !isDragging || !dragStart) return;
    
    const dx = event.clientX - dragStart[0];
    const dy = event.clientY - dragStart[1];
    
    // Update center based on drag distance
    setCenter(([lon, lat]) => {
      // Convert pixel movement to coordinate movement based on zoom level
      const lonDelta = dx * (360 / (svgRef.current?.clientWidth || 1)) / zoom;
      const latDelta = dy * (180 / (svgRef.current?.clientHeight || 1)) / zoom;
      
      return [lon - lonDelta, lat + latDelta];
    });
    
    setDragStart([event.clientX, event.clientY]);
  };
  
  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  // Handle mouse leave for dragging
  const handleSvgMouseLeave = () => {
    setIsDragging(false);
    setDragStart(null);
  };
  
  // Calculate SVG viewBox based on zoom and center
  const calculateViewBox = () => {
    if (!svgRef.current) return '0 0 1000 500';
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Calculate visible area based on zoom level
    const visibleWidth = width / zoom;
    const visibleHeight = height / zoom;
    
    // Calculate top-left corner of viewBox
    const [centerX, centerY] = geoToSvgCoords(center[0], center[1]);
    const x = centerX - visibleWidth / 2;
    const y = centerY - visibleHeight / 2;
    
    return `${x} ${y} ${visibleWidth} ${visibleHeight}`;
  };
  
  // Render geographic map
  const renderMap = () => {
    return (
      <MapContainer ref={containerRef} $width={width} $height={height}>
        <MapSvg
          ref={svgRef}
          viewBox={calculateViewBox()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleSvgMouseLeave}
        >
          {/* Map features */}
          <g>
            {features.map(feature => (
              <MapFeature
                key={feature.id}
                d={feature.path}
                fill={getFeatureColor(feature)}
                $interactive={selectable}
                $selected={feature.id === selectedFeature}
                onClick={() => handleFeatureClick(feature.id)}
                onMouseEnter={(e) => handleFeatureHover(e, feature)}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </g>
          
          {/* Map markers */}
          <g>
            {markers.map(marker => {
              const [x, y] = geoToSvgCoords(marker.longitude, marker.latitude);
              const size = getMarkerSize(marker);
              
              return (
                <g
                  key={marker.id}
                  onClick={() => handleMarkerClick(marker.id)}
                  onMouseEnter={(e) => handleMarkerHover(e, marker)}
                  onMouseLeave={handleMouseLeave}
                >
                  <MapMarkerCircle
                    cx={x}
                    cy={y}
                    r={size}
                    fill={getMarkerColor(marker)}
                    $interactive={selectable}
                    $selected={marker.id === selectedMarker}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {marker.icon ? (
                    <MapMarkerIcon
                      href={marker.icon}
                      x={x - size}
                      y={y - size}
                      width={size * 2}
                      height={size * 2}
                    />
                  ) : (
                    <MapMarkerLabel
                      x={x}
                      y={y}
                      fontSize={size}
                    >
                      {marker.name.charAt(0)}
                    </MapMarkerLabel>
                  )}
                </g>
              );
            })}
          </g>
        </MapSvg>
        
        {/* Zoom controls */}
        {interactive && (
          <ZoomControls>
            <ZoomButton onClick={handleZoomIn}>+</ZoomButton>
            <ZoomButton onClick={handleZoomOut}>-</ZoomButton>
          </ZoomControls>
        )}
        
        {/* Legend */}
        {showLegend && (
          <Legend>
            <LegendTitle>Legend</LegendTitle>
            <LegendGradient>
              <svg width="100%" height="20">
                <defs>
                  <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {colorScale.map((color, index) => (
                      <stop
                        key={index}
                        offset={`${(index / (colorScale.length - 1)) * 100}%`}
                        stopColor={color}
                      />
                    ))}
                  </linearGradient>
                </defs>
                <rect width="100%" height="20" fill="url(#legendGradient)" />
              </svg>
            </LegendGradient>
            <LegendLabels>
              <span>{valueFormatter(actualValueRange[0])}</span>
              <span>{valueFormatter(actualValueRange[1])}</span>
            </LegendLabels>
          </Legend>
        )}
        
        {/* Tooltip */}
        {tooltipData && (
          <TooltipContainer
            style={{
              left: tooltipData.x,
              top: tooltipData.y,
              transform: 'translate(-50%, -100%)'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {tooltipData.content}
          </TooltipContainer>
        )}
      </MapContainer>
    );
  };
  
  return renderMap();
};

export default GeographicMap;
