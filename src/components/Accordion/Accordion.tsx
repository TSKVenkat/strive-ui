import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { css } from 'styled-components';

// Context for Accordion
interface AccordionContextValue {
  expandedItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion component');
  }
  return context;
};

// Types
export interface AccordionProps {
  /**
   * The content of the accordion (AccordionItem components)
   */
  children: React.ReactNode;
  /**
   * Whether multiple items can be expanded at the same time
   */
  allowMultiple?: boolean;
  /**
   * Default expanded item IDs
   */
  defaultExpandedItems?: string[];
  /**
   * Controlled expanded item IDs
   */
  expandedItems?: string[];
  /**
   * Callback when expanded items change
   */
  onChange?: (expandedItems: string[]) => void;
  /**
   * Visual variant of the accordion
   */
  variant?: 'default' | 'bordered' | 'filled';
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface AccordionItemProps {
  /**
   * The content of the accordion item (AccordionHeader and AccordionPanel)
   */
  children: React.ReactNode;
  /**
   * The ID of the accordion item (must be unique)
   */
  id: string;
  /**
   * Whether the accordion item is disabled
   */
  isDisabled?: boolean;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface AccordionHeaderProps {
  /**
   * The content of the accordion header
   */
  children: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface AccordionPanelProps {
  /**
   * The content of the accordion panel
   */
  children: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
}

// Styled Components
const StyledAccordion = styled.div<{ variant: 'default' | 'bordered' | 'filled' }>`
  width: 100%;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'bordered':
        return css`
          border: 1px solid ${theme.colors.neutral[300]};
          border-radius: ${theme.borderRadius.md};
          overflow: hidden;
          
          & > * + * {
            border-top: 1px solid ${theme.colors.neutral[300]};
          }
        `;
      case 'filled':
        return css`
          background-color: ${theme.colors.neutral[100]};
          border-radius: ${theme.borderRadius.md};
          
          & > * + * {
            border-top: 1px solid ${theme.colors.neutral[200]};
          }
        `;
      default:
        return css`
          & > * + * {
            border-top: 1px solid ${theme.colors.neutral[200]};
          }
        `;
    }
  }}
`;

const StyledAccordionItem = styled.div<{ isDisabled?: boolean }>`
  width: 100%;
  ${({ isDisabled }) => isDisabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

const StyledAccordionHeader = styled.button<{ isExpanded: boolean; isDisabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[800]};
  cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const ChevronIcon = styled.span<{ isExpanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledAccordionPanel = styled.div<{ isExpanded: boolean }>`
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  max-height: ${({ isExpanded }) => isExpanded ? '1000px' : '0'};
  padding: ${({ isExpanded }) => isExpanded ? '0 1rem 1rem 1rem' : '0 1rem'};
`;

/**
 * Accordion component for displaying collapsible content panels
 * 
 * @example
 * ```jsx
 * <Accordion>
 *   <Accordion.Item id="item1">
 *     <Accordion.Header>Section 1</Accordion.Header>
 *     <Accordion.Panel>Content for section 1</Accordion.Panel>
 *   </Accordion.Item>
 *   <Accordion.Item id="item2">
 *     <Accordion.Header>Section 2</Accordion.Header>
 *     <Accordion.Panel>Content for section 2</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>;
  Header: React.FC<AccordionHeaderProps>;
  Panel: React.FC<AccordionPanelProps>;
} = ({
  children,
  allowMultiple = false,
  defaultExpandedItems = [],
  expandedItems: controlledExpandedItems,
  onChange,
  variant = 'default',
  className,
}) => {
  const [internalExpandedItems, setInternalExpandedItems] = useState<string[]>(defaultExpandedItems);
  
  // Use controlled or uncontrolled state
  const expandedItems = controlledExpandedItems !== undefined ? controlledExpandedItems : internalExpandedItems;
  
  const toggleItem = useCallback((id: string) => {
    const newExpandedItems = allowMultiple
      ? expandedItems.includes(id)
        ? expandedItems.filter(item => item !== id)
        : [...expandedItems, id]
      : expandedItems.includes(id)
        ? []
        : [id];
    
    if (controlledExpandedItems === undefined) {
      setInternalExpandedItems(newExpandedItems);
    }
    
    onChange?.(newExpandedItems);
  }, [allowMultiple, expandedItems, controlledExpandedItems, onChange]);
  
  const contextValue = {
    expandedItems,
    toggleItem,
    allowMultiple,
  };
  
  return (
    <AccordionContext.Provider value={contextValue}>
      <StyledAccordion variant={variant} className={className}>
        {children}
      </StyledAccordion>
    </AccordionContext.Provider>
  );
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  children,
  id,
  isDisabled = false,
  className,
}) => {
  // Create a new context to pass down the item ID and disabled state
  const ItemContext = React.createContext<{ id: string; isDisabled: boolean }>({ id, isDisabled });
  
  return (
    <ItemContext.Provider value={{ id, isDisabled }}>
      <StyledAccordionItem isDisabled={isDisabled} className={className}>
        {children}
      </StyledAccordionItem>
    </ItemContext.Provider>
  );
};

const AccordionHeader: React.FC<AccordionHeaderProps> = ({
  children,
  className,
}) => {
  const { expandedItems, toggleItem } = useAccordion();
  // Get the item ID and disabled state from the parent AccordionItem
  const itemContext = useContext(React.createContext<{ id: string; isDisabled: boolean }>({ id: '', isDisabled: false }));
  const { id, isDisabled } = itemContext;
  
  const isExpanded = expandedItems.includes(id);
  
  const handleClick = () => {
    if (!isDisabled) {
      toggleItem(id);
    }
  };
  
  return (
    <StyledAccordionHeader
      onClick={handleClick}
      isExpanded={isExpanded}
      isDisabled={isDisabled}
      disabled={isDisabled}
      aria-expanded={isExpanded}
      aria-controls={`panel-${id}`}
      id={`header-${id}`}
      className={className}
    >
      <span>{children}</span>
      <ChevronIcon isExpanded={isExpanded}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ChevronIcon>
    </StyledAccordionHeader>
  );
};

const AccordionPanel: React.FC<AccordionPanelProps> = ({
  children,
  className,
}) => {
  const { expandedItems } = useAccordion();
  // Get the item ID from the parent AccordionItem
  const itemContext = useContext(React.createContext<{ id: string; isDisabled: boolean }>({ id: '', isDisabled: false }));
  const { id } = itemContext;
  
  const isExpanded = expandedItems.includes(id);
  
  return (
    <StyledAccordionPanel
      isExpanded={isExpanded}
      id={`panel-${id}`}
      aria-labelledby={`header-${id}`}
      role="region"
      hidden={!isExpanded}
      className={className}
    >
      {children}
    </StyledAccordionPanel>
  );
};

// Assign components to Accordion
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;
