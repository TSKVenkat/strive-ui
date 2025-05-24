import React, { createContext, useContext, forwardRef } from 'react';
import { useMindMap, UseMindMapReturn, MindMapOptions, MindMapNode, MindMapConnection } from './useMindMap';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the MindMap component
interface MindMapContextValue extends UseMindMapReturn {}

const MindMapContext = createContext<MindMapContextValue | null>(null);

// Hook to use MindMap context
export function useMindMapContext() {
  const context = useContext(MindMapContext);
  if (!context) {
    throw new Error('useMindMapContext must be used within a MindMapHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends MindMapOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const mindMapProps = useMindMap(options);
    
    return (
      <MindMapContext.Provider value={mindMapProps}>
        <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
          {children}
        </div>
      </MindMapContext.Provider>
    );
  }
);

Root.displayName = 'MindMapHeadless.Root';

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useMindMapContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{ ...containerProps.style, ...props.style }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'MindMapHeadless.Container';

// Node component props
export type NodeProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Node ID
     */
    id: string;
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      node: MindMapNode;
      isSelected: boolean;
      isEditing: boolean;
      select: () => void;
      startEdit: () => void;
      stopEdit: (text?: string) => void;
      toggleExpansion: () => void;
      delete: () => void;
      move: (position: { x: number; y: number }) => void;
    }) => React.ReactNode);
  }
>;

// Node component
const Node = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, id, children, ...props }: NodeProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      nodes, 
      selectedNode, 
      selectNode, 
      updateNode, 
      deleteNode, 
      moveNode, 
      toggleNodeExpansion, 
      startNodeEdit, 
      stopNodeEdit 
    } = useMindMapContext();
    
    const node = nodes.find(n => n.id === id);
    if (!node) return null;
    
    const isSelected = selectedNode?.id === id;
    const isEditing = node.editing || false;
    
    const select = () => selectNode(id);
    const startEdit = () => startNodeEdit(id);
    const stopEdit = (text?: string) => stopNodeEdit(id, text);
    const toggleExpansion = () => toggleNodeExpansion(id);
    const deleteThisNode = () => deleteNode(id);
    const move = (position: { x: number; y: number }) => moveNode(id, position);
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{ 
          position: 'absolute',
          left: `${node.position.x}px`,
          top: `${node.position.y}px`,
          width: `${node.width}px`,
          height: `${node.height}px`,
          backgroundColor: node.backgroundColor,
          color: node.textColor,
          border: `${node.borderWidth}px solid ${node.borderColor}`,
          borderRadius: `${node.borderRadius}px`,
          fontSize: `${node.fontSize}px`,
          fontWeight: node.fontWeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          boxSizing: 'border-box',
          ...props.style,
        }}
        onClick={(e) => {
          e.stopPropagation();
          select();
          if (props.onClick) props.onClick(e);
        }}
      >
        {typeof children === 'function' 
          ? children({ 
              node, 
              isSelected, 
              isEditing, 
              select, 
              startEdit, 
              stopEdit, 
              toggleExpansion, 
              delete: deleteThisNode, 
              move 
            }) 
          : children || node.text}
      </Component>
    );
  }
);

Node.displayName = 'MindMapHeadless.Node';

// Connection component props
export type ConnectionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Connection ID
     */
    id: string;
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      connection: MindMapConnection;
      sourceNode: MindMapNode | undefined;
      targetNode: MindMapNode | undefined;
      update: (updates: Partial<MindMapConnection>) => void;
      delete: () => void;
    }) => React.ReactNode);
  }
>;

// Connection component
const Connection = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, id, children, ...props }: ConnectionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { connections, nodes, updateConnection, deleteConnection } = useMindMapContext();
    
    const connection = connections.find(c => c.id === id);
    if (!connection) return null;
    
    const sourceNode = nodes.find(n => n.id === connection.sourceId);
    const targetNode = nodes.find(n => n.id === connection.targetId);
    
    // Skip rendering if either node is not found
    if (!sourceNode || !targetNode) return null;
    
    // Calculate line coordinates
    const sourceX = sourceNode.position.x + (sourceNode.width || 0) / 2;
    const sourceY = sourceNode.position.y + (sourceNode.height || 0) / 2;
    const targetX = targetNode.position.x + (targetNode.width || 0) / 2;
    const targetY = targetNode.position.y + (targetNode.height || 0) / 2;
    
    // Calculate line properties
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    const update = (updates: Partial<MindMapConnection>) => updateConnection(id, updates);
    const deleteThisConnection = () => deleteConnection(id);
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{ 
          position: 'absolute',
          left: `${sourceX}px`,
          top: `${sourceY}px`,
          width: `${length}px`,
          height: `${connection.width || 2}px`,
          backgroundColor: connection.color,
          transform: `rotate(${angle}deg)`,
          transformOrigin: '0 50%',
          pointerEvents: 'none',
          ...props.style,
        }}
      >
        {typeof children === 'function' 
          ? children({ 
              connection, 
              sourceNode, 
              targetNode, 
              update, 
              delete: deleteThisConnection 
            }) 
          : children}
      </Component>
    );
  }
);

Connection.displayName = 'MindMapHeadless.Connection';

// Nodes component props
export type NodesProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      nodes: MindMapNode[];
      selectedNode: MindMapNode | null;
    }) => React.ReactNode);
  }
>;

// Nodes component
const Nodes = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: NodesProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { nodes, selectedNode } = useMindMapContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ nodes, selectedNode }) 
          : children}
      </Component>
    );
  }
);

Nodes.displayName = 'MindMapHeadless.Nodes';

// Connections component props
export type ConnectionsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      connections: MindMapConnection[];
    }) => React.ReactNode);
  }
>;

// Connections component
const Connections = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ConnectionsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { connections } = useMindMapContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ connections }) 
          : children}
      </Component>
    );
  }
);

Connections.displayName = 'MindMapHeadless.Connections';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      addNode: (data: Partial<MindMapNode> & { parentId: string | null }) => MindMapNode;
      addConnection: (data: Partial<MindMapConnection> & { sourceId: string; targetId: string }) => MindMapConnection;
      autoLayout: () => void;
      exportToJSON: () => string;
      importFromJSON: (json: string) => void;
      selectedNode: MindMapNode | null;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ControlsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      addNode, 
      addConnection, 
      autoLayout, 
      exportToJSON, 
      importFromJSON, 
      selectedNode 
    } = useMindMapContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ 
              addNode, 
              addConnection, 
              autoLayout, 
              exportToJSON, 
              importFromJSON, 
              selectedNode 
            }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'MindMapHeadless.Controls';

// NodeChildren component props
export type NodeChildrenProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Node ID
     */
    id: string;
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      children: MindMapNode[];
      parent: MindMapNode | undefined;
    }) => React.ReactNode);
  }
>;

// NodeChildren component
const NodeChildren = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, id, children, ...props }: NodeChildrenProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getNodeChildren, nodes } = useMindMapContext();
    
    const nodeChildren = getNodeChildren(id);
    const parent = nodes.find(n => n.id === id);
    
    // Skip rendering if parent node is collapsed
    if (parent && parent.expanded === false) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ children: nodeChildren, parent }) 
          : children}
      </Component>
    );
  }
);

NodeChildren.displayName = 'MindMapHeadless.NodeChildren';

// Export all components
export const MindMapHeadless = {
  Root,
  Container,
  Node,
  Connection,
  Nodes,
  Connections,
  Controls,
  NodeChildren,
  useMindMapContext,
};

export default MindMapHeadless;
