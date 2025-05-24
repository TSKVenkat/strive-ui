import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface DashboardWidgetProps {
  /**
   * Title of the widget
   */
  title: string;
  /**
   * Content to display in the widget
   */
  children: ReactNode;
  /**
   * Width of the widget (CSS value)
   */
  width?: string;
  /**
   * Height of the widget (CSS value)
   */
  height?: string;
  /**
   * Whether the widget is collapsible
   */
  collapsible?: boolean;
  /**
   * Whether the widget is initially collapsed
   */
  initiallyCollapsed?: boolean;
  /**
   * Whether the widget is resizable
   */
  resizable?: boolean;
  /**
   * Whether the widget is draggable
   */
  draggable?: boolean;
  /**
   * Whether the widget has a refresh button
   */
  refreshable?: boolean;
  /**
   * Callback when the refresh button is clicked
   */
  onRefresh?: () => void;
  /**
   * Whether the widget has a settings button
   */
  hasSettings?: boolean;
  /**
   * Callback when the settings button is clicked
   */
  onSettingsClick?: () => void;
  /**
   * Whether the widget can be removed
   */
  removable?: boolean;
  /**
   * Callback when the remove button is clicked
   */
  onRemove?: () => void;
  /**
   * Additional actions to display in the header
   */
  actions?: ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Background color of the widget
   */
  backgroundColor?: string;
  /**
   * Border color of the widget
   */
  borderColor?: string;
  /**
   * Whether to show a loading indicator
   */
  loading?: boolean;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Last updated timestamp or text
   */
  lastUpdated?: string;
  /**
   * Whether to show a footer
   */
  showFooter?: boolean;
  /**
   * Footer content
   */
  footer?: ReactNode;
}

const Widget = styled(motion.div)<{ $width?: string; $height?: string; $backgroundColor?: string; $borderColor?: string }>`
  background-color: ${({ theme, $backgroundColor }) => $backgroundColor || theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme, $borderColor }) => $borderColor || theme.colors.neutral[200]};
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  margin: 0;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const ContentContainer = styled(motion.div)<{ $loading?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  position: relative;
  overflow: auto;
  opacity: ${({ $loading }) => $loading ? 0.6 : 1};
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
`;

const LoadingSpinner = styled(motion.div)`
  width: 30px;
  height: 30px;
  border: 3px solid ${({ theme }) => theme.colors.neutral[200]};
  border-top-color: ${({ theme }) => theme.colors.primary.main};
  border-radius: 50%;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error.main};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.error.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const WidgetFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

/**
 * DashboardWidget component serves as a container for various chart types
 * and data visualizations with consistent styling, headers, and interactive features.
 */
export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  width,
  height,
  collapsible = true,
  initiallyCollapsed = false,
  resizable = false,
  draggable = false,
  refreshable = false,
  onRefresh,
  hasSettings = false,
  onSettingsClick,
  removable = false,
  onRemove,
  actions,
  className,
  backgroundColor,
  borderColor,
  loading = false,
  error,
  lastUpdated,
  showFooter = false,
  footer
}) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  
  // Toggle collapsed state
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  // Handle refresh click
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  // Handle settings click
  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
  };
  
  // Handle remove click
  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };
  
  return (
    <Widget
      className={className}
      $width={width}
      $height={height}
      $backgroundColor={backgroundColor}
      $borderColor={borderColor}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      drag={draggable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
    >
      <WidgetHeader>
        <HeaderLeft>
          <Title>{title}</Title>
        </HeaderLeft>
        
        <HeaderRight>
          {actions}
          
          {refreshable && (
            <ActionButton onClick={handleRefresh} title="Refresh">
              ↻
            </ActionButton>
          )}
          
          {hasSettings && (
            <ActionButton onClick={handleSettingsClick} title="Settings">
              ⚙️
            </ActionButton>
          )}
          
          {collapsible && (
            <ActionButton onClick={toggleCollapse} title={collapsed ? "Expand" : "Collapse"}>
              {collapsed ? '+' : '-'}
            </ActionButton>
          )}
          
          {removable && (
            <ActionButton onClick={handleRemove} title="Remove">
              ×
            </ActionButton>
          )}
        </HeaderRight>
      </WidgetHeader>
      
      <AnimatePresence>
        {!collapsed && (
          <ContentContainer
            $loading={loading}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            {loading && (
              <LoadingOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </LoadingOverlay>
            )}
            
            {children}
          </ContentContainer>
        )}
      </AnimatePresence>
      
      {showFooter && (
        <WidgetFooter>
          {footer || <div />}
          {lastUpdated && <LastUpdated>Last updated: {lastUpdated}</LastUpdated>}
        </WidgetFooter>
      )}
    </Widget>
  );
};

export default DashboardWidget;
