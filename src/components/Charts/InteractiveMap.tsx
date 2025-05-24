import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { GeographicMap, GeoFeature, MapMarker } from './GeographicMap';

export interface MapLayer {
  /**
   * Unique identifier for the layer
   */
  id: string;
  /**
   * Display name for the layer
   */
  name: string;
  /**
   * Features in this layer
   */
  features: GeoFeature[];
  /**
   * Whether the layer is visible
   */
  visible: boolean;
  /**
   * Optional layer opacity (0-1)
   */
  opacity?: number;
  /**
   * Optional layer description
   */
  description?: string;
}

export interface MarkerLayer {
  /**
   * Unique identifier for the layer
   */
  id: string;
  /**
   * Display name for the layer
   */
  name: string;
  /**
   * Markers in this layer
   */
  markers: MapMarker[];
  /**
   * Whether the layer is visible
   */
  visible: boolean;
  /**
   * Optional layer opacity (0-1)
   */
  opacity?: number;
  /**
   * Optional layer description
   */
  description?: string;
}

export interface InteractiveMapProps {
  /**
   * Map feature layers
   */
  featureLayers: MapLayer[];
  /**
   * Map marker layers
   */
  markerLayers?: MarkerLayer[];
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
  onFeatureSelect?: (featureId: string, layerId: string) => void;
  /**
   * Callback when a marker is selected
   */
  onMarkerSelect?: (markerId: string, layerId: string) => void;
  /**
   * Initial zoom level (1-10)
   */
  initialZoom?: number;
  /**
   * Initial center coordinates [longitude, latitude]
   */
  initialCenter?: [number, number];
  /**
   * Whether to show the layer control panel
   */
  showLayerControl?: boolean;
  /**
   * Whether to show the search control
   */
  showSearch?: boolean;
  /**
   * Whether to show the measurement tools
   */
  showMeasurementTools?: boolean;
  /**
   * Whether to show the fullscreen control
   */
  showFullscreenControl?: boolean;
  /**
   * Whether to show the export control
   */
  showExportControl?: boolean;
  /**
   * Color scale for choropleth layers
   */
  colorScale?: string[];
  /**
   * Whether to show a legend
   */
  showLegend?: boolean;
  /**
   * Custom value formatter for legend
   */
  valueFormatter?: (value: number) => string;
  /**
   * Base map style ('light', 'dark', 'satellite', 'terrain')
   */
  baseMapStyle?: 'light' | 'dark' | 'satellite' | 'terrain';
  /**
   * Callback when the map viewport changes
   */
  onViewportChange?: (viewport: { zoom: number; center: [number, number] }) => void;
}

const MapContainer = styled.div<{ $width: number | string; $height: number | string }>`
  width: ${({ $width }) => typeof $width === 'number' ? `${$width}px` : $width};
  height: ${({ $height }) => typeof $height === 'number' ? `${$height}px` : $height};
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ControlPanel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  max-width: 300px;
  max-height: calc(100% - 20px);
  overflow-y: auto;
  z-index: 10;
`;

const ControlHeader = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  padding-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.neutral[600]};
  
  &:hover {
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const LayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LayerItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const LayerCheckbox = styled.input`
  cursor: pointer;
`;

const LayerName = styled.span`
  flex-grow: 1;
`;

const LayerOpacity = styled.input`
  width: 60px;
`;

const SearchControl = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  z-index: 10;
  display: flex;
  gap: 8px;
`;

const SearchInput = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: 12px;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const SearchButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const ToolsControl = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[1]};
  z-index: 10;
  display: flex;
  gap: 4px;
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary.main : theme.colors.common.white};
  color: ${({ theme, $active }) => $active ? theme.colors.common.white : theme.colors.neutral[800]};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary.main : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  
  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary.dark : theme.colors.neutral[100]};
  }
`;

const MeasurementInfo = styled.div`
  position: absolute;
  bottom: 50px;
  left: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  z-index: 10;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const SearchResults = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[2]};
  z-index: 10;
  max-width: 300px;
  max-height: 300px;
  overflow-y: auto;
`;

const SearchResultItem = styled.div`
  padding: 4px 0;
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[800]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

/**
 * InteractiveMap component provides an enhanced map experience with layer controls,
 * search functionality, measurement tools, and more interactive features.
 */
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  featureLayers,
  markerLayers = [],
  width = '100%',
  height = 500,
  showTooltips = true,
  featureTooltipFormatter,
  markerTooltipFormatter,
  selectable = true,
  onFeatureSelect,
  onMarkerSelect,
  initialZoom = 1,
  initialCenter = [0, 0],
  showLayerControl = true,
  showSearch = true,
  showMeasurementTools = true,
  showFullscreenControl = true,
  showExportControl = true,
  colorScale,
  showLegend = true,
  valueFormatter,
  baseMapStyle = 'light',
  onViewportChange
}) => {
  // State for layer visibility and opacity
  const [layers, setLayers] = useState<MapLayer[]>(featureLayers);
  const [markerLayersState, setMarkerLayersState] = useState<MarkerLayer[]>(markerLayers);
  
  // State for control panel visibility
  const [layerControlVisible, setLayerControlVisible] = useState(true);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; type: 'feature' | 'marker'; layerId: string }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // State for measurement tools
  const [activeTool, setActiveTool] = useState<'none' | 'distance' | 'area'>('none');
  const [measurementPoints, setMeasurementPoints] = useState<[number, number][]>([]);
  const [measurementResult, setMeasurementResult] = useState<{ value: number; unit: string } | null>(null);
  
  // State for fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // State for map viewport
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update layers when props change
  useEffect(() => {
    setLayers(featureLayers);
  }, [featureLayers]);
  
  useEffect(() => {
    setMarkerLayersState(markerLayers);
  }, [markerLayers]);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Handle layer visibility toggle
  const toggleLayerVisibility = (layerId: string, type: 'feature' | 'marker') => {
    if (type === 'feature') {
      setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ));
    } else {
      setMarkerLayersState(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ));
    }
  };
  
  // Handle layer opacity change
  const changeLayerOpacity = (layerId: string, opacity: number, type: 'feature' | 'marker') => {
    if (type === 'feature') {
      setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, opacity } : layer
      ));
    } else {
      setMarkerLayersState(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, opacity } : layer
      ));
    }
  };
  
  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ id: string; name: string; type: 'feature' | 'marker'; layerId: string }> = [];
    
    // Search in feature layers
    layers.forEach(layer => {
      layer.features.forEach(feature => {
        if (feature.name.toLowerCase().includes(query)) {
          results.push({
            id: feature.id,
            name: feature.name,
            type: 'feature',
            layerId: layer.id
          });
        }
      });
    });
    
    // Search in marker layers
    markerLayersState.forEach(layer => {
      layer.markers.forEach(marker => {
        if (marker.name.toLowerCase().includes(query)) {
          results.push({
            id: marker.id,
            name: marker.name,
            type: 'marker',
            layerId: layer.id
          });
        }
      });
    });
    
    setSearchResults(results);
    setShowSearchResults(true);
  };
  
  // Handle search result click
  const handleSearchResultClick = (result: { id: string; type: 'feature' | 'marker'; layerId: string }) => {
    if (result.type === 'feature') {
      // Find the feature
      const layer = layers.find(l => l.id === result.layerId);
      if (!layer) return;
      
      const feature = layer.features.find(f => f.id === result.id);
      if (!feature) return;
      
      // Center map on feature (simplified approach)
      // In a real implementation, you would calculate the center of the feature's path
      setCenter([0, 0]); // Placeholder
      setZoom(5); // Zoom in
      
      // Select the feature
      if (onFeatureSelect) {
        onFeatureSelect(result.id, result.layerId);
      }
    } else {
      // Find the marker
      const layer = markerLayersState.find(l => l.id === result.layerId);
      if (!layer) return;
      
      const marker = layer.markers.find(m => m.id === result.id);
      if (!marker) return;
      
      // Center map on marker
      setCenter([marker.longitude, marker.latitude]);
      setZoom(5); // Zoom in
      
      // Select the marker
      if (onMarkerSelect) {
        onMarkerSelect(result.id, result.layerId);
      }
    }
    
    // Close search results
    setShowSearchResults(false);
  };
  
  // Handle measurement tool activation
  const activateMeasurementTool = (tool: 'distance' | 'area') => {
    setActiveTool(prev => prev === tool ? 'none' : tool);
    setMeasurementPoints([]);
    setMeasurementResult(null);
  };
  
  // Handle map click for measurement
  const handleMapClick = (event: React.MouseEvent) => {
    if (activeTool === 'none') return;
    
    // In a real implementation, you would convert screen coordinates to map coordinates
    // This is a simplified placeholder
    const point: [number, number] = [0, 0]; // Placeholder
    
    setMeasurementPoints(prev => [...prev, point]);
    
    // Calculate measurement
    if (activeTool === 'distance' && measurementPoints.length > 0) {
      // Calculate distance between points
      // This is a simplified placeholder
      setMeasurementResult({
        value: 100, // Placeholder
        unit: 'km'
      });
    } else if (activeTool === 'area' && measurementPoints.length > 2) {
      // Calculate area of polygon
      // This is a simplified placeholder
      setMeasurementResult({
        value: 1000, // Placeholder
        unit: 'km²'
      });
    }
  };
  
  // Handle export
  const handleExport = () => {
    // In a real implementation, you would generate an image of the map
    // This is a simplified placeholder
    alert('Map exported!');
  };
  
  // Combine visible layers for GeographicMap
  const visibleFeatures = layers
    .filter(layer => layer.visible)
    .flatMap(layer => layer.features.map(feature => ({
      ...feature,
      // Apply layer opacity if defined
      opacity: layer.opacity !== undefined ? layer.opacity : 1
    })));
  
  const visibleMarkers = markerLayersState
    .filter(layer => layer.visible)
    .flatMap(layer => layer.markers.map(marker => ({
      ...marker,
      // Apply layer opacity if defined
      opacity: layer.opacity !== undefined ? layer.opacity : 1
    })));
  
  // Handle viewport change
  const handleViewportChange = (newZoom: number, newCenter: [number, number]) => {
    setZoom(newZoom);
    setCenter(newCenter);
    
    if (onViewportChange) {
      onViewportChange({ zoom: newZoom, center: newCenter });
    }
  };
  
  // Handle feature selection
  const handleFeatureSelect = (featureId: string) => {
    // Find which layer the feature belongs to
    for (const layer of layers) {
      const feature = layer.features.find(f => f.id === featureId);
      if (feature) {
        if (onFeatureSelect) {
          onFeatureSelect(featureId, layer.id);
        }
        break;
      }
    }
  };
  
  // Handle marker selection
  const handleMarkerSelect = (markerId: string) => {
    // Find which layer the marker belongs to
    for (const layer of markerLayersState) {
      const marker = layer.markers.find(m => m.id === markerId);
      if (marker) {
        if (onMarkerSelect) {
          onMarkerSelect(markerId, layer.id);
        }
        break;
      }
    }
  };
  
  return (
    <MapContainer ref={containerRef} $width={width} $height={height} onClick={handleMapClick}>
      <GeographicMap
        features={visibleFeatures}
        markers={visibleMarkers}
        width="100%"
        height="100%"
        showTooltips={showTooltips}
        featureTooltipFormatter={featureTooltipFormatter}
        markerTooltipFormatter={markerTooltipFormatter}
        selectable={selectable}
        onFeatureSelect={handleFeatureSelect}
        onMarkerSelect={handleMarkerSelect}
        interactive={true}
        initialZoom={zoom}
        initialCenter={center}
        colorScale={colorScale}
        showLegend={showLegend}
        valueFormatter={valueFormatter}
      />
      
      {/* Layer Control */}
      {showLayerControl && (
        <ControlPanel>
          <ControlHeader>
            Layers
            <ControlToggle onClick={() => setLayerControlVisible(!layerControlVisible)}>
              {layerControlVisible ? '−' : '+'}
            </ControlToggle>
          </ControlHeader>
          
          {layerControlVisible && (
            <LayerList>
              {/* Feature Layers */}
              {layers.map(layer => (
                <LayerItem key={`feature-${layer.id}`}>
                  <LayerCheckbox
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => toggleLayerVisibility(layer.id, 'feature')}
                  />
                  <LayerName title={layer.description || layer.name}>
                    {layer.name}
                  </LayerName>
                  <LayerOpacity
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={layer.opacity || 1}
                    onChange={(e) => changeLayerOpacity(layer.id, parseFloat(e.target.value), 'feature')}
                  />
                </LayerItem>
              ))}
              
              {/* Marker Layers */}
              {markerLayersState.map(layer => (
                <LayerItem key={`marker-${layer.id}`}>
                  <LayerCheckbox
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => toggleLayerVisibility(layer.id, 'marker')}
                  />
                  <LayerName title={layer.description || layer.name}>
                    {layer.name}
                  </LayerName>
                  <LayerOpacity
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={layer.opacity || 1}
                    onChange={(e) => changeLayerOpacity(layer.id, parseFloat(e.target.value), 'marker')}
                  />
                </LayerItem>
              ))}
            </LayerList>
          )}
        </ControlPanel>
      )}
      
      {/* Search Control */}
      {showSearch && (
        <SearchControl>
          <SearchInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch}>
            Search
          </SearchButton>
        </SearchControl>
      )}
      
      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <SearchResults>
          {searchResults.map(result => (
            <SearchResultItem
              key={`${result.type}-${result.id}`}
              onClick={() => handleSearchResultClick(result)}
            >
              {result.name}
            </SearchResultItem>
          ))}
        </SearchResults>
      )}
      
      {/* Measurement Tools */}
      {showMeasurementTools && (
        <ToolsControl>
          <ToolButton
            $active={activeTool === 'distance'}
            onClick={() => activateMeasurementTool('distance')}
            title="Measure Distance"
          >
            📏
          </ToolButton>
          <ToolButton
            $active={activeTool === 'area'}
            onClick={() => activateMeasurementTool('area')}
            title="Measure Area"
          >
            📐
          </ToolButton>
          {showFullscreenControl && (
            <ToolButton
              $active={isFullscreen}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? '⊙' : '⊕'}
            </ToolButton>
          )}
          {showExportControl && (
            <ToolButton
              onClick={handleExport}
              title="Export Map"
            >
              💾
            </ToolButton>
          )}
        </ToolsControl>
      )}
      
      {/* Measurement Result */}
      {measurementResult && (
        <MeasurementInfo>
          {activeTool === 'distance' ? 'Distance: ' : 'Area: '}
          {measurementResult.value.toLocaleString()} {measurementResult.unit}
        </MeasurementInfo>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;
