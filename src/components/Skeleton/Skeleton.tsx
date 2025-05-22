import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius of the skeleton */
  borderRadius?: string;
  /** Whether to animate the skeleton */
  animate?: boolean;
  /** Number of lines to display (for text skeletons) */
  lines?: number;
  /** Gap between lines (for text skeletons) */
  lineGap?: string;
  /** Variant of the skeleton */
  variant?: 'text' | 'circular' | 'rectangular';
}

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const SkeletonBase = styled.div<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animate?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || '100%')};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height || '1.2em')};
  border-radius: ${({ borderRadius }) => borderRadius || '4px'};
  display: inline-block;
  animation: ${({ animate }) => (animate ? `${pulse} 1.5s ease-in-out infinite` : 'none')};
`;

const TextContainer = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap || '0.5em'};
  width: 100%;
`;

export const Skeleton = ({
  width,
  height,
  borderRadius,
  animate = true,
  lines = 1,
  lineGap = '0.5em',
  variant = 'text',
}: SkeletonProps) => {
  const getSkeletonByVariant = () => {
    switch (variant) {
      case 'circular':
        return (
          <SkeletonBase
            width={width || '40px'}
            height={height || '40px'}
            borderRadius="50%"
            animate={animate}
            aria-label="Loading"
            role="status"
          />
        );
      case 'rectangular':
        return (
          <SkeletonBase
            width={width}
            height={height || '100px'}
            borderRadius={borderRadius}
            animate={animate}
            aria-label="Loading"
            role="status"
          />
        );
      case 'text':
      default:
        if (lines === 1) {
          return (
            <SkeletonBase
              width={width}
              height={height}
              borderRadius={borderRadius}
              animate={animate}
              aria-label="Loading"
              role="status"
            />
          );
        }
        
        return (
          <TextContainer gap={lineGap} role="status" aria-label="Loading">
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonBase
                key={index}
                width={index === lines - 1 && !width ? '80%' : width}
                height={height}
                borderRadius={borderRadius}
                animate={animate}
              />
            ))}
          </TextContainer>
        );
    }
  };

  return getSkeletonByVariant();
};

Skeleton.displayName = 'Skeleton';
