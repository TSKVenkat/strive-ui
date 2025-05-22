import React from 'react';
import { IconWeight } from './Icon';

// Interface for icon components
interface IconComponentProps {
  weight?: IconWeight;
}

// Helper function to get stroke width based on weight
const getStrokeWidth = (weight: IconWeight = 'regular'): number => {
  const strokeWidths: Record<IconWeight, number> = {
    light: 1,
    regular: 1.5,
    medium: 2,
    bold: 2.5,
    fill: 0,
  };
  
  return strokeWidths[weight] || strokeWidths.regular;
};

// Helper function to get fill based on weight
const getFill = (weight: IconWeight = 'regular'): string => {
  return weight === 'fill' ? 'currentColor' : 'none';
};

// Icon components
// Each icon follows the same pattern with weight variants

export const Activity: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <path
    d="M22 12h-4l-3 9L9 3l-3 9H2"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={getFill(weight)}
  />
);

export const AlertCircle: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      fill={getFill(weight)}
    />
    <line
      x1="12"
      y1="8"
      x2="12"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="16"
      x2="12.01"
      y2="16"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
    />
  </>
);

export const AlertTriangle: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <path
    d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={getFill(weight)}
  />
);

export const ArrowDown: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="19 12 12 19 5 12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const ArrowLeft: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="19"
      y1="12"
      x2="5"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="12 19 5 12 12 5"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const ArrowRight: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="12 5 19 12 12 19"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const ArrowUp: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="12"
      y1="19"
      x2="12"
      y2="5"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="5 12 12 5 19 12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const Check: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polyline
    points="20 6 9 17 4 12"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const CheckCircle: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M22 11.08V12a10 10 0 11-5.93-9.14"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <polyline
      points="22 4 12 14.01 9 11.01"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const ChevronDown: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polyline
    points="6 9 12 15 18 9"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const ChevronLeft: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polyline
    points="15 18 9 12 15 6"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const ChevronRight: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polyline
    points="9 18 15 12 9 6"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const ChevronUp: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polyline
    points="18 15 12 9 6 15"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const Close: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Edit: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

export const Eye: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

export const EyeOff: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

export const Filter: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polygon
    points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={getFill(weight)}
  />
);

export const Heart: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <path
    d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={weight === 'fill' ? 'currentColor' : 'none'}
  />
);

export const Home: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <polyline
      points="9 22 9 12 15 12 15 22"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const Info: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <line
      x1="12"
      y1="16"
      x2="12"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="8"
      x2="12.01"
      y2="8"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Mail: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <polyline
      points="22,6 12,13 2,6"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </>
);

export const Menu: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Moon: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <path
    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={getFill(weight)}
  />
);

export const Plus: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Search: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <circle
      cx="11"
      cy="11"
      r="8"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <line
      x1="21"
      y1="21"
      x2="16.65"
      y2="16.65"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Settings: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

export const Star: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <polygon
    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    stroke="currentColor"
    strokeWidth={getStrokeWidth(weight)}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill={weight === 'fill' ? 'currentColor' : 'none'}
  />
);

export const Sun: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <circle
      cx="12"
      cy="12"
      r="5"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <line
      x1="12"
      y1="1"
      x2="12"
      y2="3"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12"
      y1="21"
      x2="12"
      y2="23"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="4.22"
      y1="4.22"
      x2="5.64"
      y2="5.64"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="18.36"
      y1="18.36"
      x2="19.78"
      y2="19.78"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="1"
      y1="12"
      x2="3"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="21"
      y1="12"
      x2="23"
      y2="12"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="4.22"
      y1="19.78"
      x2="5.64"
      y2="18.36"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="18.36"
      y1="5.64"
      x2="19.78"
      y2="4.22"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const Trash: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <polyline
      points="3 6 5 6 21 6"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <line
      x1="10"
      y1="11"
      x2="10"
      y2="17"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

export const User: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <circle
      cx="12"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

export const Users: React.FC<IconComponentProps> = ({ weight = 'regular' }) => (
  <>
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
    <path
      d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      stroke="currentColor"
      strokeWidth={getStrokeWidth(weight)}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={getFill(weight)}
    />
  </>
);

// Add more icons as needed

// X is an alias for Close
export const X = Close;
