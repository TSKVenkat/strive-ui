# Strive UI Chart Components

This documentation provides a comprehensive guide to using and customizing the chart components in the Strive UI library. These components are designed to be highly customizable, allowing developers to create beautiful and interactive data visualizations with minimal effort.

## Table of Contents

1. [Introduction](#introduction)
2. [Common Features](#common-features)
3. [Basic Charts](#basic-charts)
   - [AreaChart](#areachart)
   - [BarChart](#barchart)
   - [BoxPlotChart](#boxplotchart)
   - [BubbleChart](#bubblechart)
   - [CalendarHeatmap](#calendarheatmap)
4. [Advanced Charts](#advanced-charts)
   - [CandlestickChart](#candlestickchart)
   - [ComparativeChart](#comparativechart)
   - [DonutChart](#donutchart)
5. [Map Components](#map-components)
   - [ChoroplethMap](#choroplethmap)
   - [GeographicMap](#geographicmap)
   - [InteractiveMap](#interactivemap)
6. [Dashboard Components](#dashboard-components)
   - [KPICard](#kpicard)
   - [MetricCard](#metriccard)
   - [StatisticsPanel](#statisticspanel)
   - [DashboardWidget](#dashboardwidget)
7. [Customization](#customization)
8. [Best Practices](#best-practices)

## Introduction

The Strive UI chart components are built using React and TypeScript, with styling provided by styled-components and animations powered by framer-motion. All chart components are designed to be:

- **Responsive**: Charts automatically adjust to their container size
- **Interactive**: Features like tooltips, zooming, and selection are available
- **Customizable**: Extensive props for styling and behavior customization
- **Accessible**: Proper ARIA attributes and keyboard navigation
- **Type-safe**: Full TypeScript support with comprehensive interfaces

Most chart components extend a base `Chart` component that provides common functionality, with specialized features added for each chart type.

## Common Features

All chart components share these common features:

- **Data Formatting**: Consistent data structure across chart types
- **Theming**: Integration with the Strive UI theme system
- **Tooltips**: Interactive tooltips on data points
- **Animations**: Smooth transitions and animations
- **Legends**: Customizable legends for data series
- **Axes**: Configurable axes with custom labels and formatting
- **Responsiveness**: Automatic resizing to fit containers
- **Events**: Callbacks for interactions like clicks and hovers

## Basic Charts

### AreaChart

The AreaChart component displays data as an area chart, which is a line chart with the area below the line filled. It inherits all the customization options and interactive features of the LineChart.

```tsx
import { AreaChart } from 'pulseui';

// Basic usage
<AreaChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Series 1',
        data: [30, 40, 35, 50, 49, 60]
      }
    ]
  }}
  height="300px"
/>

// Advanced usage with customization
<AreaChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Series 1',
        data: [30, 40, 35, 50, 49, 60],
        color: '#3f51b5'
      },
      {
        name: 'Series 2',
        data: [20, 25, 30, 35, 40, 30],
        color: '#f50057'
      }
    ]
  }}
  height="300px"
  areaOpacity={0.4}
  showPoints={true}
  showGrid={true}
  showLegend={true}
  curveType="natural"
  showTooltips={true}
  tooltipFormatter={(value, label, seriesName) => 
    `${seriesName}: ${value} units in ${label}`
  }
/>
```

#### Props

The AreaChart extends the LineChart props, with `showArea` automatically set to `true`:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartData` | Required | Data for the chart |
| `areaOpacity` | `number` | `0.3` | Opacity of the filled area |
| All LineChart props | - | - | All props from LineChart are available |

### BarChart

The BarChart component displays data as a bar chart with various customization options and interactive features. It supports vertical or horizontal bars, grouped or stacked layouts, and extensive styling options.

```tsx
import { BarChart } from 'pulseui';

// Basic usage
<BarChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Series 1',
        data: [30, 40, 35, 50, 49, 60]
      }
    ]
  }}
  height="300px"
/>

// Advanced usage with customization
<BarChart
  data={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Series 1',
        data: [30, 40, 35, 50, 49, 60],
        color: '#3f51b5'
      },
      {
        name: 'Series 2',
        data: [20, 25, 30, 35, 40, 30],
        color: '#f50057'
      }
    ]
  }}
  height="300px"
  horizontal={false}
  grouped={true}
  stacked={false}
  borderRadius={4}
  barPadding={0.1}
  groupPadding={0.2}
  showDataLabels={true}
  dataLabelFormatter={(value) => `${value}%`}
  showTooltips={true}
  tooltipFormatter={(value, label, seriesName) => 
    `${seriesName}: ${value} units in ${label}`
  }
  showGrid={true}
  showYAxisZeroLine={true}
  animateOnDataChange={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartData` | Required | Data for the chart |
| `horizontal` | `boolean` | `false` | Whether to use horizontal bars |
| `grouped` | `boolean` | `false` | Whether to use grouped bars |
| `stacked` | `boolean` | `false` | Whether to stack bars |
| `borderRadius` | `number` | `4` | Bar border radius |
| `barPadding` | `number` | `0.1` | Bar padding |
| `groupPadding` | `number` | `0.2` | Group padding |
| `showDataLabels` | `boolean` | `false` | Whether to show data labels |
| `dataLabelFormatter` | `(value: number) => string` | `value => value.toString()` | Data label formatter |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(value: number, label: string, seriesName: string) => string` | - | Custom tooltip formatter |
| `yAxisMin` | `number` | - | Y-axis min value |
| `yAxisMax` | `number` | - | Y-axis max value |
| `showYAxisZeroLine` | `boolean` | `true` | Whether to show the y-axis zero line |
| `animateOnDataChange` | `boolean` | `true` | Whether to animate on data change |

### BoxPlotChart

The BoxPlotChart component visualizes statistical data distribution with quartiles, medians, and outliers. It's perfect for displaying the distribution of data sets and identifying outliers.

```tsx
import { BoxPlotChart } from 'pulseui';

// Basic usage
<BoxPlotChart
  data={[
    {
      label: 'Dataset A',
      min: 10,
      q1: 20,
      median: 30,
      q3: 40,
      max: 50,
      outliers: [5, 55]
    },
    {
      label: 'Dataset B',
      min: 15,
      q1: 25,
      median: 35,
      q3: 45,
      max: 55
    }
  ]}
  height="300px"
/>

// Advanced usage with customization
<BoxPlotChart
  data={[
    {
      label: 'Dataset A',
      min: 10,
      q1: 20,
      median: 30,
      q3: 40,
      max: 50,
      outliers: [5, 55],
      color: '#3f51b5'
    },
    {
      label: 'Dataset B',
      min: 15,
      q1: 25,
      median: 35,
      q3: 45,
      max: 55,
      color: '#f50057'
    }
  ]}
  height="300px"
  showTooltips={true}
  tooltipFormatter={(dataPoint) => (
    <>
      <div>Min: {dataPoint.min}</div>
      <div>Q1: {dataPoint.q1}</div>
      <div>Median: {dataPoint.median}</div>
      <div>Q3: {dataPoint.q3}</div>
      <div>Max: {dataPoint.max}</div>
      {dataPoint.outliers && dataPoint.outliers.length > 0 && (
        <div>Outliers: {dataPoint.outliers.join(', ')}</div>
      )}
    </>
  )}
  showGrid={true}
  showOutliers={true}
  showNotches={false}
  animateOnDataChange={true}
  valueFormatter={(value) => `${value.toFixed(1)}`}
  boxWidthRatio={0.6}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `BoxPlotDataPoint[]` | Required | Data for the chart |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(dataPoint: BoxPlotDataPoint) => React.ReactNode` | - | Custom tooltip formatter |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showOutliers` | `boolean` | `true` | Whether to show outliers |
| `showNotches` | `boolean` | `false` | Whether to show notches for confidence intervals |
| `animateOnDataChange` | `boolean` | `true` | Whether to animate on data change |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom value formatter |
| `boxWidthRatio` | `number` | `0.6` | Box width as a ratio of available space (0-1) |

### BubbleChart

The BubbleChart component displays data as bubbles on a two-dimensional chart, with the bubble size representing a third dimension of data. It extends the ScatterPlot with specialized bubble visualization features.

```tsx
import { BubbleChart } from 'pulseui';

// Basic usage
<BubbleChart
  data={{
    series: [
      {
        name: 'Series 1',
        data: [
          { x: 10, y: 20, size: 5 },
          { x: 15, y: 25, size: 10 },
          { x: 20, y: 30, size: 15 }
        ]
      }
    ]
  }}
  height="300px"
/>

// Advanced usage with customization
<BubbleChart
  data={{
    series: [
      {
        name: 'Series 1',
        data: [
          { x: 10, y: 20, size: 5, label: 'Point A' },
          { x: 15, y: 25, size: 10, label: 'Point B' },
          { x: 20, y: 30, size: 15, label: 'Point C' }
        ],
        color: '#3f51b5'
      },
      {
        name: 'Series 2',
        data: [
          { x: 12, y: 22, size: 8, label: 'Point D' },
          { x: 17, y: 27, size: 12, label: 'Point E' },
          { x: 22, y: 32, size: 18, label: 'Point F' }
        ],
        color: '#f50057'
      }
    ]
  }}
  height="300px"
  bubbleSizeRange={[10, 50]}
  showBubbleLabels={true}
  showTooltips={true}
  tooltipFormatter={(x, y, size, label, seriesName) => 
    `${label || seriesName}\nX: ${x}\nY: ${y}\nSize: ${size}`
  }
  showGrid={true}
  showLegend={true}
  xAxisLabel="X Axis"
  yAxisLabel="Y Axis"
/>
```

#### Props

The BubbleChart extends the ScatterPlot props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ScatterPlotData` | Required | Data for the chart |
| `bubbleSizeRange` | `[number, number]` | `[10, 50]` | Bubble size range [min, max] for bubble sizing |
| `showBubbleLabels` | `boolean` | `false` | Whether to show bubble labels |
| All ScatterPlot props | - | - | All props from ScatterPlot are available |

### CalendarHeatmap

The CalendarHeatmap component displays data over time in a calendar view, with color intensity representing values. It's perfect for visualizing activity or metrics over days, weeks, months, or years.

```tsx
import { CalendarHeatmap } from 'pulseui';

// Basic usage
<CalendarHeatmap
  data={[
    { date: new Date(2023, 0, 1), value: 5 },
    { date: new Date(2023, 0, 2), value: 10 },
    { date: new Date(2023, 0, 3), value: 3 },
    // ... more dates
  ]}
  height="200px"
/>

// Advanced usage with customization
<CalendarHeatmap
  data={[
    { date: new Date(2023, 0, 1), value: 5, label: 'New Year' },
    { date: new Date(2023, 0, 2), value: 10 },
    { date: new Date(2023, 0, 3), value: 3 },
    // ... more dates
  ]}
  height="200px"
  startDate={new Date(2023, 0, 1)}
  endDate={new Date(2023, 11, 31)}
  viewMode="year"
  showMonthLabels={true}
  showDayLabels={true}
  showTooltips={true}
  tooltipFormatter={(date, value, label) => 
    `${date.toLocaleDateString()}\nValue: ${value}${label ? `\n${label}` : ''}`
  }
  colorRange={['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']}
  logScale={false}
  showColorLegend={true}
  cellSize={12}
  cellPadding={2}
  animateOnDataChange={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CalendarHeatmapData[]` | Required | Calendar heatmap data |
| `startDate` | `Date` | - | Start date for the calendar |
| `endDate` | `Date` | - | End date for the calendar |
| `viewMode` | `'year' \| 'month' \| 'week'` | `'year'` | View mode |
| `showMonthLabels` | `boolean` | `true` | Whether to show month labels |
| `showDayLabels` | `boolean` | `true` | Whether to show day labels |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(date: Date, value: number, label?: string) => string` | - | Custom tooltip formatter |
| `colorRange` | `string[]` | `['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']` | Color range for the heatmap |
| `logScale` | `boolean` | `false` | Whether to use a logarithmic scale for color mapping |
| `showColorLegend` | `boolean` | `true` | Whether to show a color legend |
| `cellSize` | `number` | `12` | Cell size in pixels |
| `cellPadding` | `number` | `2` | Cell padding in pixels |
| `animateOnDataChange` | `boolean` | `true` | Whether to animate on data change |

## Advanced Charts

### CandlestickChart

The CandlestickChart component visualizes financial data with open, high, low, and close values, with optional volume display and interactive features. It's perfect for stock market data and financial analysis.

```tsx
import { CandlestickChart } from 'pulseui';

// Basic usage
<CandlestickChart
  data={[
    { date: '2023-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000 },
    { date: '2023-01-02', open: 105, high: 115, low: 100, close: 110, volume: 1200 },
    // ... more data points
  ]}
  height="400px"
/>

// Advanced usage with customization
<CandlestickChart
  data={[
    { date: '2023-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000 },
    { date: '2023-01-02', open: 105, high: 115, low: 100, close: 110, volume: 1200 },
    // ... more data points
  ]}
  height="400px"
  showTooltips={true}
  tooltipFormatter={(dataPoint) => (
    <>
      <div>Date: {dataPoint.date}</div>
      <div>Open: ${dataPoint.open}</div>
      <div>High: ${dataPoint.high}</div>
      <div>Low: ${dataPoint.low}</div>
      <div>Close: ${dataPoint.close}</div>
      <div>Volume: {dataPoint.volume?.toLocaleString()}</div>
    </>
  )}
  showVolume={true}
  showGrid={true}
  showCrosshair={true}
  upColor="#4caf50"
  downColor="#f44336"
  volumeColor="#2196f3"
  volumeHeightRatio={0.2}
  animateOnDataChange={true}
  priceFormatter={(value) => `$${value.toFixed(2)}`}
  dateFormatter={(date) => new Date(date).toLocaleDateString()}
  volumeFormatter={(volume) => volume.toLocaleString()}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CandlestickDataPoint[]` | Required | Candlestick data points |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(dataPoint: CandlestickDataPoint) => React.ReactNode` | - | Custom tooltip formatter |
| `showVolume` | `boolean` | `true` | Whether to show volume bars |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showCrosshair` | `boolean` | `true` | Whether to show crosshair on hover |
| `upColor` | `string` | `'#4caf50'` | Color for up candles (close > open) |
| `downColor` | `string` | `'#f44336'` | Color for down candles (close < open) |
| `volumeColor` | `string` | `'#2196f3'` | Color for volume bars |
| `volumeHeightRatio` | `number` | `0.2` | Height ratio for volume section (0-1) |
| `animateOnDataChange` | `boolean` | `true` | Whether to animate on data change |
| `priceFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom price formatter |
| `dateFormatter` | `(date: string \| Date) => string` | `date => date instanceof Date ? date.toLocaleDateString() : date` | Custom date formatter |
| `volumeFormatter` | `(volume: number) => string` | `volume => volume.toLocaleString()` | Custom volume formatter |

### ComparativeChart

The ComparativeChart component is designed for comparing multiple data series with features like synchronized axes, difference highlighting, and percentage change visualization. It's ideal for comparing performance metrics, financial data, or any other numerical data sets.

```tsx
import { ComparativeChart } from 'pulseui';

// Basic usage
<ComparativeChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  series={[
    { name: 'Series A', data: [30, 40, 35, 50, 49, 60] },
    { name: 'Series B', data: [20, 30, 25, 40, 39, 50] }
  ]}
  height="400px"
/>

// Advanced usage with customization
<ComparativeChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
  series={[
    { name: 'Series A', data: [30, 40, 35, 50, 49, 60], color: '#3f51b5' },
    { name: 'Series B', data: [20, 30, 25, 40, 39, 50], color: '#f50057' }
  ]}
  height="400px"
  mode="side-by-side"
  showTooltips={true}
  showLegend={true}
  showGrid={true}
  showDifference={true}
  showPercentageChange={true}
  valueFormatter={(value) => `$${value.toLocaleString()}`}
  percentageFormatter={(value) => `${value.toFixed(1)}%`}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `labels` | `string[]` | Required | Labels for the x-axis |
| `series` | `ComparativeDataSeries[]` | Required | Data series to compare |
| `mode` | `'side-by-side' \| 'overlay' \| 'stacked' \| 'percentage'` | `'side-by-side'` | Comparison mode |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `showLegend` | `boolean` | `true` | Whether to show the legend |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showDifference` | `boolean` | `true` | Whether to show difference indicators |
| `showPercentageChange` | `boolean` | `true` | Whether to show percentage change |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom value formatter |
| `percentageFormatter` | `(value: number) => string` | `value => ${value.toFixed(1)}%` | Custom percentage formatter |

### DonutChart

The DonutChart component displays data as a donut chart, which is a pie chart with a hole in the center. It's useful for showing proportions of a whole and can include interactive features like tooltips and selection.

```tsx
import { DonutChart } from 'pulseui';

// Basic usage
<DonutChart
  data={{
    labels: ['Category A', 'Category B', 'Category C'],
    series: [
      { name: 'Series 1', data: [30, 40, 30] }
    ]
  }}
  height="300px"
/>

// Advanced usage with customization
<DonutChart
  data={{
    labels: ['Category A', 'Category B', 'Category C'],
    series: [
      { name: 'Series 1', data: [30, 40, 30] }
    ]
  }}
  height="300px"
  innerRadius={0.6}
  outerRadius={0.9}
  cornerRadius={4}
  padAngle={0.02}
  showTooltips={true}
  tooltipFormatter={(value, label) => `${label}: ${value} (${(value / 100 * 100).toFixed(1)}%)`}
  showLegend={true}
  showLabels={true}
  showValues={true}
  valueFormatter={(value) => `${value}`}
  percentageFormatter={(value) => `${(value * 100).toFixed(1)}%`}
  colors={['#3f51b5', '#f50057', '#4caf50']}
  selectable={true}
  onSliceSelect={(index) => console.log(`Selected slice ${index}`)}
  animateOnDataChange={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartData` | Required | Data for the chart |
| `innerRadius` | `number` | `0.6` | Inner radius as a ratio of the outer radius (0-1) |
| `outerRadius` | `number` | `0.9` | Outer radius as a ratio of the container size (0-1) |
| `cornerRadius` | `number` | `0` | Corner radius for the slices |
| `padAngle` | `number` | `0` | Padding angle between slices |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(value: number, label: string) => string` | - | Custom tooltip formatter |
| `showLegend` | `boolean` | `true` | Whether to show the legend |
| `showLabels` | `boolean` | `false` | Whether to show labels on the slices |
| `showValues` | `boolean` | `false` | Whether to show values on the slices |
| `valueFormatter` | `(value: number) => string` | `value => value.toString()` | Custom value formatter |
| `percentageFormatter` | `(value: number) => string` | `value => ${(value * 100).toFixed(1)}%` | Custom percentage formatter |
| `colors` | `string[]` | - | Custom colors for the slices |
| `selectable` | `boolean` | `false` | Whether slices are selectable |
| `onSliceSelect` | `(index: number) => void` | - | Callback when a slice is selected |
| `animateOnDataChange` | `boolean` | `true` | Whether to animate on data change |

## Map Components

### ChoroplethMap

The ChoroplethMap component visualizes statistical data across geographic regions with color intensity representing values. It's ideal for showing data distribution across countries, states, or any other geographic divisions.

```tsx
import { ChoroplethMap } from 'pulseui';

// Basic usage
<ChoroplethMap
  regions={[
    { id: 'US', name: 'United States', path: 'M...', value: 100 },
    { id: 'CA', name: 'Canada', path: 'M...', value: 80 },
    // ... more regions
  ]}
  height="500px"
/>

// Advanced usage with customization
<ChoroplethMap
  regions={[
    { 
      id: 'US', 
      name: 'United States', 
      path: 'M...', 
      value: 100,
      data: { population: '331 million', gdp: '$21.4 trillion' }
    },
    { 
      id: 'CA', 
      name: 'Canada', 
      path: 'M...', 
      value: 80,
      data: { population: '38 million', gdp: '$1.6 trillion' }
    },
    // ... more regions
  ]}
  height="500px"
  showTooltips={true}
  tooltipFormatter={(region) => (
    <>
      <div>{region.name}</div>
      <div>Value: {region.value}</div>
      <div>Population: {region.data?.population}</div>
      <div>GDP: {region.data?.gdp}</div>
    </>
  )}
  selectable={true}
  onRegionSelect={(regionId) => console.log(`Selected region: ${regionId}`)}
  interactive={true}
  initialZoom={1}
  initialCenter={[0, 0]}
  colorScale={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
  valueRange={[0, 100]}
  showLegend={true}
  legendTitle="Data Values"
  valueFormatter={(value) => value.toLocaleString()}
  normalizeValues={false}
  showNoDataRegions={true}
  noDataColor="#f0f0f0"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `regions` | `ChoroplethRegion[]` | Required | Regions with data to render on the map |
| `width` | `number \| string` | `'100%'` | Width of the map container |
| `height` | `number \| string` | `500` | Height of the map container |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `tooltipFormatter` | `(region: ChoroplethRegion) => React.ReactNode` | - | Custom tooltip formatter |
| `selectable` | `boolean` | `true` | Whether to enable region selection |
| `onRegionSelect` | `(regionId: string) => void` | - | Callback when a region is selected |
| `interactive` | `boolean` | `true` | Whether to enable zooming and panning |
| `initialZoom` | `number` | `1` | Initial zoom level (1-10) |
| `initialCenter` | `[number, number]` | `[0, 0]` | Initial center coordinates [longitude, latitude] |
| `colorScale` | `string[]` | `['#f7fbff', ..., '#08306b']` | Color scale for the choropleth |
| `valueRange` | `[number, number]` | - | Value range for color scale [min, max] |
| `showLegend` | `boolean` | `true` | Whether to show a legend |
| `legendTitle` | `string` | `'Data Values'` | Title for the legend |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom value formatter for legend and tooltips |
| `normalizeValues` | `boolean` | `false` | Whether to normalize values (0-1 scale) |
| `showNoDataRegions` | `boolean` | `true` | Whether to show missing data regions |
| `noDataColor` | `string` | `'#f0f0f0'` | Color for regions with no data |

### GeographicMap

The GeographicMap component provides a flexible base for rendering interactive maps with features and markers. It supports tooltips, selection, zooming, and panning, making it perfect for geographic data visualization.

```tsx
import { GeographicMap } from 'pulseui';

// Basic usage
<GeographicMap
  features={[
    { id: 'feature1', name: 'Feature 1', path: 'M...' },
    { id: 'feature2', name: 'Feature 2', path: 'M...' },
    // ... more features
  ]}
  height="500px"
/>

// Advanced usage with customization
<GeographicMap
  features={[
    { 
      id: 'feature1', 
      name: 'Feature 1', 
      path: 'M...', 
      value: 100,
      color: '#3f51b5',
      data: { area: '1,000 sq km', population: '5 million' }
    },
    // ... more features
  ]}
  markers={[
    {
      id: 'marker1',
      name: 'Marker 1',
      latitude: 40.7128,
      longitude: -74.0060,
      value: 50,
      color: '#f50057',
      icon: 'https://example.com/icon.svg',
      data: { type: 'City', population: '8.4 million' }
    },
    // ... more markers
  ]}
  width="100%"
  height="500px"
  showTooltips={true}
  featureTooltipFormatter={(feature) => (
    <>
      <div>{feature.name}</div>
      <div>Value: {feature.value}</div>
      <div>Area: {feature.data?.area}</div>
      <div>Population: {feature.data?.population}</div>
    </>
  )}
  markerTooltipFormatter={(marker) => (
    <>
      <div>{marker.name}</div>
      <div>Type: {marker.data?.type}</div>
      <div>Population: {marker.data?.population}</div>
    </>
  )}
  selectable={true}
  onFeatureSelect={(featureId) => console.log(`Selected feature: ${featureId}`)}
  onMarkerSelect={(markerId) => console.log(`Selected marker: ${markerId}`)}
  interactive={true}
  initialZoom={3}
  initialCenter={[-98.5795, 39.8283]}
  colorScale={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
  valueRange={[0, 100]}
  showLegend={true}
  valueFormatter={(value) => value.toLocaleString()}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `GeoFeature[]` | Required | GeoJSON features to render |
| `markers` | `MapMarker[]` | `[]` | Optional markers to display on the map |
| `width` | `number \| string` | `'100%'` | Width of the map container |
| `height` | `number \| string` | `500` | Height of the map container |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `featureTooltipFormatter` | `(feature: GeoFeature) => React.ReactNode` | - | Custom tooltip formatter for features |
| `markerTooltipFormatter` | `(marker: MapMarker) => React.ReactNode` | - | Custom tooltip formatter for markers |
| `selectable` | `boolean` | `true` | Whether to enable feature selection |
| `onFeatureSelect` | `(featureId: string) => void` | - | Callback when a feature is selected |
| `onMarkerSelect` | `(markerId: string) => void` | - | Callback when a marker is selected |
| `interactive` | `boolean` | `true` | Whether to enable zooming and panning |
| `initialZoom` | `number` | `1` | Initial zoom level (1-10) |
| `initialCenter` | `[number, number]` | `[0, 0]` | Initial center coordinates [longitude, latitude] |
| `colorScale` | `string[]` | `['#f7fbff', ..., '#08306b']` | Color scale for choropleth features |
| `valueRange` | `[number, number]` | - | Value range for color scale [min, max] |
| `showLegend` | `boolean` | `true` | Whether to show a legend |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom value formatter for legend |

### InteractiveMap

The InteractiveMap component provides an enhanced map experience with layer controls, search functionality, measurement tools, and more interactive features. It extends the GeographicMap with additional capabilities for advanced geographic data visualization and interaction.

```tsx
import { InteractiveMap } from 'pulseui';

// Basic usage
<InteractiveMap
  featureLayers={[
    {
      id: 'layer1',
      name: 'Countries',
      features: [
        { id: 'us', name: 'United States', path: 'M...' },
        { id: 'ca', name: 'Canada', path: 'M...' },
        // ... more features
      ],
      visible: true
    }
  ]}
  height="500px"
/>

// Advanced usage with customization
<InteractiveMap
  featureLayers={[
    {
      id: 'countries',
      name: 'Countries',
      features: [
        { id: 'us', name: 'United States', path: 'M...', value: 100 },
        { id: 'ca', name: 'Canada', path: 'M...', value: 80 },
        // ... more features
      ],
      visible: true,
      opacity: 0.8,
      description: 'Country boundaries with data'
    },
    {
      id: 'rivers',
      name: 'Rivers',
      features: [
        { id: 'mississippi', name: 'Mississippi River', path: 'M...' },
        // ... more features
      ],
      visible: false,
      opacity: 0.6,
      description: 'Major rivers'
    }
  ]}
  markerLayers={[
    {
      id: 'cities',
      name: 'Major Cities',
      markers: [
        {
          id: 'nyc',
          name: 'New York City',
          latitude: 40.7128,
          longitude: -74.0060,
          value: 8400000,
          color: '#f50057'
        },
        // ... more markers
      ],
      visible: true,
      opacity: 1,
      description: 'Major cities with population data'
    }
  ]}
  width="100%"
  height="600px"
  showTooltips={true}
  featureTooltipFormatter={(feature) => (
    <>
      <div>{feature.name}</div>
      {feature.value && <div>Value: {feature.value.toLocaleString()}</div>}
      {feature.data && Object.entries(feature.data).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
      ))}
    </>
  )}
  markerTooltipFormatter={(marker) => (
    <>
      <div>{marker.name}</div>
      {marker.value && <div>Population: {marker.value.toLocaleString()}</div>}
      {marker.data && Object.entries(marker.data).map(([key, value]) => (
        <div key={key}>{key}: {value}</div>
      ))}
    </>
  )}
  selectable={true}
  onFeatureSelect={(featureId, layerId) => console.log(`Selected ${featureId} from layer ${layerId}`)}
  onMarkerSelect={(markerId, layerId) => console.log(`Selected ${markerId} from layer ${layerId}`)}
  initialZoom={2}
  initialCenter={[0, 20]}
  showLayerControl={true}
  showSearch={true}
  showMeasurementTools={true}
  showFullscreenControl={true}
  showExportControl={true}
  colorScale={['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']}
  showLegend={true}
  valueFormatter={(value) => value.toLocaleString()}
  baseMapStyle="light"
  onViewportChange={(viewport) => console.log(`Zoom: ${viewport.zoom}, Center: ${viewport.center}`)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `featureLayers` | `MapLayer[]` | Required | Map feature layers |
| `markerLayers` | `MarkerLayer[]` | `[]` | Map marker layers |
| `width` | `number \| string` | `'100%'` | Width of the map container |
| `height` | `number \| string` | `500` | Height of the map container |
| `showTooltips` | `boolean` | `true` | Whether to show tooltips on hover |
| `featureTooltipFormatter` | `(feature: GeoFeature) => React.ReactNode` | - | Custom tooltip formatter for features |
| `markerTooltipFormatter` | `(marker: MapMarker) => React.ReactNode` | - | Custom tooltip formatter for markers |
| `selectable` | `boolean` | `true` | Whether to enable feature selection |
| `onFeatureSelect` | `(featureId: string, layerId: string) => void` | - | Callback when a feature is selected |
| `onMarkerSelect` | `(markerId: string, layerId: string) => void` | - | Callback when a marker is selected |
| `initialZoom` | `number` | `1` | Initial zoom level (1-10) |
| `initialCenter` | `[number, number]` | `[0, 0]` | Initial center coordinates [longitude, latitude] |
| `showLayerControl` | `boolean` | `true` | Whether to show the layer control panel |
| `showSearch` | `boolean` | `true` | Whether to show the search control |
| `showMeasurementTools` | `boolean` | `true` | Whether to show the measurement tools |
| `showFullscreenControl` | `boolean` | `true` | Whether to show the fullscreen control |
| `showExportControl` | `boolean` | `true` | Whether to show the export control |
| `colorScale` | `string[]` | - | Color scale for choropleth layers |
| `showLegend` | `boolean` | `true` | Whether to show a legend |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Custom value formatter for legend |
| `baseMapStyle` | `'light' \| 'dark' \| 'satellite' \| 'terrain'` | `'light'` | Base map style |
| `onViewportChange` | `(viewport: { zoom: number; center: [number, number] }) => void` | - | Callback when the map viewport changes |

## Dashboard Components

### KPICard

The KPICard component displays key performance indicators with current values, trends, and visual indicators. It's perfect for dashboards and analytics interfaces.

```tsx
import { KPICard } from 'pulseui';

// Basic usage
<KPICard
  title="Total Revenue"
  value={1250000}
  previousValue={1000000}
/>

// Advanced usage with customization
<KPICard
  title="Total Revenue"
  value={1250000}
  previousValue={1000000}
  valueFormatter={(value) => `$${(value / 1000000).toFixed(2)}M`}
  percentageFormatter={(value) => `${value.toFixed(1)}%`}
  icon={<DollarIcon />}
  trend="up"
  trendValue={25}
  color="#4caf50"
  showTrend={true}
  showPercentage={true}
  showIcon={true}
  showMiniChart={true}
  miniChartData={[980000, 1020000, 1150000, 1180000, 1250000]}
  status="success"
  subtitle="Monthly revenue"
  footer="Last updated: Today"
  onClick={() => console.log('KPI card clicked')}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Title of the KPI |
| `value` | `number` | Required | Current value of the KPI |
| `previousValue` | `number` | - | Previous value for comparison |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Format function for the value |
| `percentageFormatter` | `(value: number) => string` | `value => ${value.toFixed(1)}%` | Format function for the percentage |
| `icon` | `React.ReactNode` | - | Icon to display |
| `trend` | `'up' \| 'down' \| 'neutral'` | - | Trend direction |
| `trendValue` | `number` | - | Trend value (percentage) |
| `color` | `string` | - | Custom color for the card |
| `showTrend` | `boolean` | `true` | Whether to show the trend indicator |
| `showPercentage` | `boolean` | `true` | Whether to show the percentage change |
| `showIcon` | `boolean` | `true` | Whether to show the icon |
| `showMiniChart` | `boolean` | `false` | Whether to show a mini chart |
| `miniChartData` | `number[]` | - | Data for the mini chart |
| `status` | `'success' \| 'warning' \| 'error' \| 'info'` | - | Status indicator |
| `subtitle` | `string` | - | Subtitle text |
| `footer` | `React.ReactNode` | - | Footer content |
| `onClick` | `() => void` | - | Click handler for the card |

### MetricCard

The MetricCard component displays detailed metrics with historical context, sparkline visualization, and additional related metrics. It's ideal for dashboards that need to show more comprehensive data.

```tsx
import { MetricCard } from 'pulseui';

// Basic usage
<MetricCard
  title="Website Traffic"
  value={15000}
  target={12000}
/>

// Advanced usage with customization
<MetricCard
  title="Website Traffic"
  value={15000}
  target={12000}
  history={[
    { label: 'Jan', value: 10000 },
    { label: 'Feb', value: 11200 },
    { label: 'Mar', value: 12500 },
    { label: 'Apr', value: 13800 },
    { label: 'May', value: 15000 }
  ]}
  valueFormatter={(value) => value.toLocaleString()}
  percentageFormatter={(value) => `${value.toFixed(1)}%`}
  icon={<UsersIcon />}
  higherIsBetter={true}
  warningThreshold={8000}
  dangerThreshold={5000}
  color="#3f51b5"
  showSparkline={true}
  showHistoryTable={true}
  additionalMetrics={[
    { label: 'Bounce Rate', value: 42.5, formatter: (value) => `${value}%` },
    { label: 'Avg. Session', value: 3.2, formatter: (value) => `${value} min` }
  ]}
  info="Monthly unique visitors"
  onClick={() => console.log('Metric card clicked')}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Title of the metric |
| `value` | `number` | Required | Current value of the metric |
| `target` | `number` | - | Target value for the metric |
| `history` | `MetricDataPoint[]` | `[]` | Historical data for the metric |
| `valueFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Format function for the value |
| `percentageFormatter` | `(value: number) => string` | `value => ${value.toFixed(1)}%` | Format function for the percentage |
| `icon` | `React.ReactNode` | - | Icon to display |
| `higherIsBetter` | `boolean` | `true` | Whether higher values are better (affects color) |
| `warningThreshold` | `number` | - | Threshold for warning color |
| `dangerThreshold` | `number` | - | Threshold for danger color |
| `color` | `string` | - | Custom color for the card |
| `showSparkline` | `boolean` | `true` | Whether to show a sparkline chart |
| `showHistoryTable` | `boolean` | `true` | Whether to show the full history table |
| `additionalMetrics` | `{ label: string; value: number; formatter?: (value: number) => string }[]` | `[]` | Additional metrics to display |
| `info` | `string` | - | Additional information or context |
| `onClick` | `() => void` | - | Click handler for the card |

### StatisticsPanel

The StatisticsPanel component displays multiple related statistics in a structured layout with optional grouping, visualizations, and comparisons. It's perfect for dashboards and analytics pages.

```tsx
import { StatisticsPanel } from 'pulseui';

// Basic usage
<StatisticsPanel
  title="Website Analytics"
  statistics={[
    { id: 'visitors', label: 'Visitors', value: 15000, previousValue: 12000 },
    { id: 'pageviews', label: 'Page Views', value: 45000, previousValue: 40000 },
    { id: 'bounce', label: 'Bounce Rate', value: 42.5, previousValue: 45.2, higherIsBetter: false }
  ]}
/>

// Advanced usage with customization
<StatisticsPanel
  title="Website Analytics"
  groups={[
    {
      id: 'traffic',
      title: 'Traffic Metrics',
      statistics: [
        { 
          id: 'visitors', 
          label: 'Visitors', 
          value: 15000, 
          previousValue: 12000,
          icon: <UsersIcon />,
          color: '#3f51b5',
          history: [
            { label: 'Jan', value: 10000 },
            { label: 'Feb', value: 11200 },
            { label: 'Mar', value: 12500 },
            { label: 'Apr', value: 13800 },
            { label: 'May', value: 15000 }
          ]
        },
        { 
          id: 'pageviews', 
          label: 'Page Views', 
          value: 45000, 
          previousValue: 40000,
          icon: <EyeIcon />,
          color: '#f50057',
          history: [
            { label: 'Jan', value: 35000 },
            { label: 'Feb', value: 38000 },
            { label: 'Mar', value: 41000 },
            { label: 'Apr', value: 43000 },
            { label: 'May', value: 45000 }
          ]
        }
      ],
      collapsible: true,
      initiallyCollapsed: false,
      description: 'Key traffic metrics for the website'
    },
    {
      id: 'engagement',
      title: 'Engagement Metrics',
      statistics: [
        { 
          id: 'bounce', 
          label: 'Bounce Rate', 
          value: 42.5, 
          previousValue: 45.2, 
          higherIsBetter: false,
          icon: <BounceIcon />,
          color: '#4caf50',
          formatter: (value) => `${value}%`
        },
        { 
          id: 'duration', 
          label: 'Avg. Session Duration', 
          value: 3.2, 
          previousValue: 2.8,
          icon: <ClockIcon />,
          color: '#ff9800',
          formatter: (value) => `${value} min`
        }
      ],
      collapsible: true,
      initiallyCollapsed: false,
      description: 'User engagement metrics'
    }
  ]}
  layout="grid"
  columns={3}
  showComparison={true}
  showVisualizations={true}
  defaultFormatter={(value) => value.toLocaleString()}
  showHeader={true}
  collapsible={true}
  initiallyCollapsed={false}
  onStatisticClick={(id) => console.log(`Clicked on statistic: ${id}`)}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Title for the panel |
| `statistics` | `StatisticItem[]` | `[]` | Statistics to display |
| `groups` | `StatisticGroup[]` | `[]` | Grouped statistics |
| `layout` | `'grid' \| 'list'` | `'grid'` | Layout for the statistics |
| `columns` | `number` | `3` | Number of columns in grid layout |
| `showComparison` | `boolean` | `true` | Whether to show comparison with previous values |
| `showVisualizations` | `boolean` | `true` | Whether to show mini visualizations |
| `defaultFormatter` | `(value: number) => string` | `value => value.toLocaleString()` | Default formatter for values |
| `showHeader` | `boolean` | `true` | Whether to show the panel header |
| `collapsible` | `boolean` | `false` | Whether the panel is collapsible |
| `initiallyCollapsed` | `boolean` | `false` | Whether the panel is initially collapsed |
| `onStatisticClick` | `(id: string) => void` | - | Click handler for a statistic item |

### DashboardWidget

The DashboardWidget component serves as a container for various chart types and data visualizations with consistent styling, headers, and interactive features. It's perfect for building modular dashboards.

```tsx
import { DashboardWidget } from 'pulseui';

// Basic usage
<DashboardWidget title="Revenue Chart">
  <BarChart
    data={{
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [
        { name: 'Revenue', data: [30, 40, 35, 50, 49, 60] }
      ]
    }}
  />
</DashboardWidget>

// Advanced usage with customization
<DashboardWidget
  title="Revenue Chart"
  width="100%"
  height="400px"
  collapsible={true}
  initiallyCollapsed={false}
  resizable={true}
  draggable={true}
  refreshable={true}
  onRefresh={() => console.log('Refreshing data...')}
  hasSettings={true}
  onSettingsClick={() => console.log('Opening settings...')}
  removable={true}
  onRemove={() => console.log('Removing widget...')}
  actions={<Button>Export</Button>}
  backgroundColor="#ffffff"
  borderColor="#e0e0e0"
  loading={false}
  error=""
  lastUpdated="2 minutes ago"
  showFooter={true}
  footer={<div>Data source: Sales API</div>}
>
  <BarChart
    data={{
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [
        { name: 'Revenue', data: [30, 40, 35, 50, 49, 60], color: '#3f51b5' }
      ]
    }}
    height="300px"
    showGrid={true}
    showTooltips={true}
  />
</DashboardWidget>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | Required | Title of the widget |
| `children` | `ReactNode` | Required | Content to display in the widget |
| `width` | `string` | `'100%'` | Width of the widget (CSS value) |
| `height` | `string` | `'auto'` | Height of the widget (CSS value) |
| `collapsible` | `boolean` | `true` | Whether the widget is collapsible |
| `initiallyCollapsed` | `boolean` | `false` | Whether the widget is initially collapsed |
| `resizable` | `boolean` | `false` | Whether the widget is resizable |
| `draggable` | `boolean` | `false` | Whether the widget is draggable |
| `refreshable` | `boolean` | `false` | Whether the widget has a refresh button |
| `onRefresh` | `() => void` | - | Callback when the refresh button is clicked |
| `hasSettings` | `boolean` | `false` | Whether the widget has a settings button |
| `onSettingsClick` | `() => void` | - | Callback when the settings button is clicked |
| `removable` | `boolean` | `false` | Whether the widget can be removed |
| `onRemove` | `() => void` | - | Callback when the remove button is clicked |
| `actions` | `ReactNode` | - | Additional actions to display in the header |
| `backgroundColor` | `string` | - | Background color of the widget |
| `borderColor` | `string` | - | Border color of the widget |
| `loading` | `boolean` | `false` | Whether to show a loading indicator |
| `error` | `string` | - | Error message to display |
| `lastUpdated` | `string` | - | Last updated timestamp or text |
| `showFooter` | `boolean` | `false` | Whether to show a footer |
| `footer` | `ReactNode` | - | Footer content |
