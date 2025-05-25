import React, { createContext, useContext, forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import {
  Content,
  Attachments,
  Attachment,
  Reactions,
  Reaction,
  Timestamp,
  Status,
  ReplyTo,
  Actions,
  LoadMore,
  TypingIndicator
} from './ChatMessagesComponents';
import styled from 'styled-components';
import useChatMessages, { 
  UseChatMessagesOptions, 
  UseChatMessagesReturn, 
  ChatMessage, 
  ChatUser, 
  ChatAttachment,
  ChatReaction
} from './useChatMessages';

// Create context for the chat messages
export const ChatMessagesContext = createContext<UseChatMessagesReturn | null>(null);

// Hook to use chat messages context
export const useChatMessagesContext = () => {
  const context = useContext(ChatMessagesContext);
  if (!context) {
    throw new Error('useChatMessagesContext must be used within a ChatMessages.Root component');
  }
  return context;
};

// Types for the compound components
export interface ChatMessagesRootProps extends React.HTMLAttributes<HTMLDivElement>, UseChatMessagesOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the list container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Whether to auto scroll to the bottom when new messages arrive
   * @default true
   */
  autoScroll?: boolean;
  
  /**
   * Threshold in pixels from the bottom to trigger auto scroll
   * @default 100
   */
  autoScrollThreshold?: number;
}

export interface ChatMessagesGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the group container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The group data
   */
  group: {
    user: ChatUser;
    messages: ChatMessage[];
    timestamp: Date | string;
  };
}

export interface ChatMessagesItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the message container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The message data
   */
  message: ChatMessage;
}

export interface ChatMessagesContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the message content
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesAttachmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the attachments container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesAttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the attachment container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The attachment data
   */
  attachment: ChatAttachment;
}

export interface ChatMessagesReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the reactions container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesReactionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the reaction button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * The reaction type
   */
  reaction: string;
  
  /**
   * The message to react to
   */
  message: ChatMessage;
  
  /**
   * The count of this reaction
   */
  count: number;
  
  /**
   * Whether the current user has reacted with this reaction
   */
  hasReacted: boolean;
}

export interface ChatMessagesTimestampProps extends React.HTMLAttributes<HTMLTimeElement> {
  /**
   * The component used for the timestamp
   * @default 'time'
   */
  as?: React.ElementType;
  
  /**
   * Date format
   * @default 'relative'
   */
  format?: 'relative' | 'full' | 'short' | 'time';
}

export interface ChatMessagesStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the status container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The message to show status for
   */
  message: ChatMessage;
}

export interface ChatMessagesReplyToProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the reply container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The message being replied to
   */
  message: ChatMessage;
}

export interface ChatMessagesActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the actions container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The message to show actions for
   */
  message: ChatMessage;
}

export interface ChatMessagesActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the action button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * The action type
   */
  action: 'reply' | 'edit' | 'delete' | 'react';
  
  /**
   * The message to perform the action on
   */
  message: ChatMessage;
}

export interface ChatMessagesTypingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the typing indicator
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'onSubmit'> {
  /**
   * The component used for the input
   * @default 'textarea'
   */
  as?: React.ElementType;
  
  /**
   * Placeholder text for the input
   * @default 'Type a message...'
   */
  placeholder?: string;
  
  /**
   * Whether to auto focus the input
   * @default true
   */
  autoFocus?: boolean;
  
  /**
   * Whether to auto resize the input based on content
   * @default true
   */
  autoResize?: boolean;
  
  /**
   * Maximum number of rows for auto resize
   * @default 5
   */
  maxRows?: number;
  
  /**
   * Whether to submit on Enter key (Shift+Enter for new line)
   * @default true
   */
  submitOnEnter?: boolean;
  
  /**
   * Callback when the input value changes
   */
  onChange?: (value: string) => void;
  
  /**
   * Callback when the input is submitted
   */
  onSubmit?: (value: string) => void;
}

export interface ChatMessagesAttachButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the attach button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * Accepted file types
   * @default '*'
   */
  accept?: string;
  
  /**
   * Maximum file size in bytes
   * @default undefined
   */
  maxSize?: number;
  
  /**
   * Maximum number of files
   * @default undefined
   */
  maxFiles?: number;
  
  /**
   * Callback when files are selected
   */
  onAttach?: (files: File[]) => void;
}

export interface ChatMessagesSendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the send button
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface ChatMessagesLoadMoreProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the load more button
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface ChatMessagesEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the empty state container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ChatMessagesLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the loading state container
   * @default 'div'
   */
  as?: React.ElementType;
}

// Root component
export const Root = forwardRef<HTMLDivElement, ChatMessagesRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract chat messages options from props
    const {
      initialMessages,
      currentUser,
      groupByUser,
      groupTimeThreshold,
      showTimestamps,
      showReadReceipts,
      showTypingIndicators,
      onSendMessage,
      onEditMessage,
      onDeleteMessage,
      onAddReaction,
      onRemoveReaction,
      onReadMessage,
      onLoadMoreMessages,
      ...restProps
    } = props;
    
    // Use the chat messages hook
    const chatMessagesState = useChatMessages({
      initialMessages,
      currentUser,
      groupByUser,
      groupTimeThreshold,
      showTimestamps,
      showReadReceipts,
      showTypingIndicators,
      onSendMessage,
      onEditMessage,
      onDeleteMessage,
      onAddReaction,
      onRemoveReaction,
      onReadMessage,
      onLoadMoreMessages,
    });
    
    return (
      <ChatMessagesContext.Provider value={chatMessagesState}>
        <Component
          ref={ref}
          className={`strive-chat-messages ${className}`}
          {...restProps}
        >
          {children}
        </Component>
      </ChatMessagesContext.Provider>
    );
  }
);

Root.displayName = 'ChatMessages.Root';

// List component
export const List = forwardRef<HTMLDivElement, ChatMessagesListProps>(
  ({ 
    as: Component = 'div', 
    children, 
    className = '', 
    autoScroll = true,
    autoScrollThreshold = 100,
    ...props 
  }, ref) => {
    const { groupedMessages, messages } = useChatMessagesContext();
    const listRef = useRef<HTMLDivElement>(null);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    
    // Handle auto scrolling
    useEffect(() => {
      if (!autoScroll || !listRef.current || !shouldAutoScroll) {
        return;
      }
      
      const listElement = listRef.current;
      listElement.scrollTop = listElement.scrollHeight;
    }, [messages, autoScroll, shouldAutoScroll]);
    
    // Check if user has scrolled up
    const handleScroll = () => {
      if (!listRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight <= autoScrollThreshold;
      
      setShouldAutoScroll(isNearBottom);
    };
    
    // Use useImperativeHandle for proper ref forwarding
    useEffect(() => {
      // Handle scroll events
      const currentRef = listRef.current;
      if (currentRef) {
        currentRef.addEventListener('scroll', handleScroll);
        return () => {
          currentRef.removeEventListener('scroll', handleScroll);
        };
      }
    }, [handleScroll]);
    
    // Create a memoized callback for the scroll handler
    const memoizedHandleScroll = useCallback(handleScroll, [autoScrollThreshold]);
    
    // Use a ref callback that doesn't try to modify ref.current directly
    const setListRef = useCallback((element: HTMLDivElement | null) => {
      // Store the element in our internal ref without using .current assignment
      if (element) {
        // Create a new ref object to avoid modifying the existing one
        const newRef = { current: element };
        // Replace the entire ref object instead of modifying .current
        Object.assign(listRef, newRef);
        
        // Add scroll event listener directly
        element.addEventListener('scroll', memoizedHandleScroll);
      }
      
      // Forward the ref using the appropriate pattern
      if (ref) {
        if (typeof ref === 'function') {
          ref(element);
        }
      }
    }, [ref, memoizedHandleScroll]);
    
    return (
      <Component
        ref={setListRef}
        className={`strive-chat-messages-list ${className}`}
        onScroll={handleScroll}
        {...props}
      >
        {children || (
          <>
            <LoadMore />
            
            {groupedMessages.map((group, index) => (
              <Group key={`${group.user.id}-${index}`} group={group} />
            ))}
            
            <TypingIndicator />
          </>
        )}
      </Component>
    );
  }
);

List.displayName = 'ChatMessages.List';

// Group component
export const Group = forwardRef<HTMLDivElement, ChatMessagesGroupProps>(
  ({ as: Component = 'div', group, children, className = '', ...props }, ref) => {
    const { currentUser } = useChatMessagesContext();
    const isCurrentUser = group.user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-group ${isCurrentUser ? 'current-user' : ''} ${className}`}
        {...props}
      >
        {children || (
          <>
            {!isCurrentUser && (
              <div className="strive-chat-messages-group-avatar">
                {group.user.avatarUrl ? (
                  <img src={group.user.avatarUrl} alt={group.user.name} />
                ) : (
                  <div className="strive-chat-messages-avatar-placeholder">
                    {group.user.name.charAt(0)}
                  </div>
                )}
              </div>
            )}
            
            <div className="strive-chat-messages-group-content">
              {!isCurrentUser && (
                <div className="strive-chat-messages-group-name">
                  {group.user.name}
                </div>
              )}
              
              <div className="strive-chat-messages-group-messages">
                {group.messages.map((message) => (
                  <Item key={message.id} message={message} />
                ))}
              </div>
            </div>
          </>
        )}
      </Component>
    );
  }
);

Group.displayName = 'ChatMessages.Group';

// Item component
export const Item = forwardRef<HTMLDivElement, ChatMessagesItemProps>(
  ({ as: Component = 'div', message, children, className = '', ...props }, ref) => {
    const { currentUser } = useChatMessagesContext();
    const isCurrentUser = message.user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-item ${isCurrentUser ? 'current-user' : ''} ${message.isPending ? 'pending' : ''} ${message.isFailed ? 'failed' : ''} ${message.isDeleted ? 'deleted' : ''} ${className}`}
        {...props}
      >
        {children || (
          <>
            {message.replyTo && (
              <ReplyTo message={message.replyTo} />
            )}
            
            <Content>{message.content}</Content>
            
            {message.attachments && message.attachments.length > 0 && (
              <Attachments>
                {message.attachments.map((attachment) => (
                  <Attachment key={attachment.id} attachment={attachment} />
                ))}
              </Attachments>
            )}
            
            {message.reactions && message.reactions.length > 0 && (
              <Reactions>
                {/* Group reactions by type */}
                {Object.entries(
                  message.reactions.reduce<Record<string, { count: number; users: ChatUser[] }>>(
                    (acc, reaction) => {
                      if (!acc[reaction.type]) {
                        acc[reaction.type] = { count: 0, users: [] };
                      }
                      acc[reaction.type].count += 1;
                      acc[reaction.type].users.push(reaction.user);
                      return acc;
                    },
                    {}
                  )
                ).map(([type, { count, users }]) => (
                  <Reaction
                    key={type}
                    reaction={type}
                    message={message}
                    count={count}
                    hasReacted={users.some(user => user.id === currentUser?.id)}
                  />
                ))}
              </Reactions>
            )}
            
            <div className="strive-chat-messages-item-footer">
              {message.timestamp && (
                <Timestamp>{message.timestamp}</Timestamp>
              )}
              
              {isCurrentUser && (
                <Status message={message} />
              )}
            </div>
            
            <Actions message={message} />
          </>
        )}
      </Component>
    );
  }
);

Item.displayName = 'ChatMessages.Item';
