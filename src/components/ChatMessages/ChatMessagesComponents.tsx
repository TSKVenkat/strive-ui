import React, { forwardRef, useRef, useEffect, useState, ChangeEvent, KeyboardEvent, useCallback } from 'react';
import { 
  useChatMessagesContext,
  ChatMessagesContentProps,
  ChatMessagesAttachmentsProps,
  ChatMessagesAttachmentProps,
  ChatMessagesReactionsProps,
  ChatMessagesReactionProps,
  ChatMessagesTimestampProps,
  ChatMessagesStatusProps,
  ChatMessagesReplyToProps,
  ChatMessagesActionsProps,
  ChatMessagesActionProps,
  ChatMessagesTypingIndicatorProps,
  ChatMessagesInputProps,
  ChatMessagesAttachButtonProps,
  ChatMessagesSendButtonProps,
  ChatMessagesLoadMoreProps,
  ChatMessagesEmptyProps,
  ChatMessagesLoadingProps
} from './ChatMessages';
import { UseChatMessagesReturn } from './useChatMessages';

// Content component
const Content = forwardRef<HTMLDivElement, ChatMessagesContentProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-content ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'ChatMessages.Content';

// Attachments component
const Attachments = forwardRef<HTMLDivElement, ChatMessagesAttachmentsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-attachments ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Attachments.displayName = 'ChatMessages.Attachments';

// Attachment component
const Attachment = forwardRef<HTMLDivElement, ChatMessagesAttachmentProps>(
  ({ as: Component = 'div', attachment, className = '', ...props }, ref) => {
    // Render different attachment types
    const renderAttachment = () => {
      switch (attachment.type) {
        case 'image':
          return (
            <div className="strive-chat-messages-attachment-image">
              <img 
                src={attachment.url} 
                alt={attachment.name || 'Image attachment'} 
                width={attachment.width} 
                height={attachment.height}
                loading="lazy"
              />
            </div>
          );
        case 'video':
          return (
            <div className="strive-chat-messages-attachment-video">
              <video 
                src={attachment.url} 
                controls 
                width={attachment.width} 
                height={attachment.height}
                preload="metadata"
              />
            </div>
          );
        case 'audio':
          return (
            <div className="strive-chat-messages-attachment-audio">
              <audio src={attachment.url} controls preload="metadata" />
            </div>
          );
        case 'file':
          return (
            <a 
              href={attachment.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="strive-chat-messages-attachment-file"
              download={attachment.name}
            >
              <div className="strive-chat-messages-attachment-file-icon">
                {/* File icon based on mime type */}
                📄
              </div>
              <div className="strive-chat-messages-attachment-file-info">
                <div className="strive-chat-messages-attachment-file-name">
                  {attachment.name || 'File attachment'}
                </div>
                {attachment.size && (
                  <div className="strive-chat-messages-attachment-file-size">
                    {formatFileSize(attachment.size)}
                  </div>
                )}
              </div>
            </a>
          );
        default:
          return (
            <a 
              href={attachment.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="strive-chat-messages-attachment-generic"
            >
              {attachment.name || 'Attachment'}
            </a>
          );
      }
    };
    
    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-attachment strive-chat-messages-attachment-${attachment.type} ${className}`}
        {...props}
      >
        {renderAttachment()}
      </Component>
    );
  }
);

Attachment.displayName = 'ChatMessages.Attachment';

// Reactions component
const Reactions = forwardRef<HTMLDivElement, ChatMessagesReactionsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-reactions ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Reactions.displayName = 'ChatMessages.Reactions';

// Reaction component
const Reaction = forwardRef<HTMLButtonElement, ChatMessagesReactionProps>(
  ({ as: Component = 'button', reaction, message, count, hasReacted, className = '', ...props }, ref) => {
    const { addReaction, removeReaction } = useChatMessagesContext();
    
    const handleClick = () => {
      if (hasReacted) {
        removeReaction(message, reaction);
      } else {
        addReaction(message, reaction);
      }
    };
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-chat-messages-reaction ${hasReacted ? 'active' : ''} ${className}`}
        onClick={handleClick}
        aria-pressed={hasReacted}
        {...props}
      >
        <span className="strive-chat-messages-reaction-emoji">{reaction}</span>
        <span className="strive-chat-messages-reaction-count">{count}</span>
      </Component>
    );
  }
);

Reaction.displayName = 'ChatMessages.Reaction';

// Timestamp component
const Timestamp = forwardRef<HTMLTimeElement, ChatMessagesTimestampProps>(
  ({ as: Component = 'time', children, className = '', format = 'relative', ...props }, ref) => {
    // Format date based on the format prop
    const formatDate = (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      switch (format) {
        case 'relative':
          // Simple relative time formatting
          const now = new Date();
          const diffMs = now.getTime() - dateObj.getTime();
          const diffSec = Math.floor(diffMs / 1000);
          const diffMin = Math.floor(diffSec / 60);
          const diffHour = Math.floor(diffMin / 60);
          const diffDay = Math.floor(diffHour / 24);
          
          if (diffSec < 60) return 'just now';
          if (diffMin < 60) return `${diffMin}m ago`;
          if (diffHour < 24) return `${diffHour}h ago`;
          if (diffDay < 7) return `${diffDay}d ago`;
          
          return dateObj.toLocaleDateString();
          
        case 'full':
          return dateObj.toLocaleString();
          
        case 'short':
          return dateObj.toLocaleDateString();
          
        case 'time':
          return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
        default:
          return String(date);
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-timestamp ${className}`}
        dateTime={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {typeof children === 'string' || children instanceof Date 
          ? formatDate(children) 
          : children}
      </Component>
    );
  }
);

Timestamp.displayName = 'ChatMessages.Timestamp';

// Status component
const Status = forwardRef<HTMLDivElement, ChatMessagesStatusProps>(
  ({ as: Component = 'div', message, className = '', ...props }, ref) => {
    // Determine message status
    const getStatus = () => {
      if (message.isPending) return 'Sending...';
      if (message.isFailed) return 'Failed to send';
      if (message.isRead) return 'Read';
      if (message.isDelivered) return 'Delivered';
      return 'Sent';
    };
    
    // Determine status icon
    const getStatusIcon = () => {
      if (message.isPending) return '⏳';
      if (message.isFailed) return '❌';
      if (message.isRead) return '✓✓';
      if (message.isDelivered) return '✓✓';
      return '✓';
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-status ${message.isPending ? 'pending' : ''} ${message.isFailed ? 'failed' : ''} ${message.isRead ? 'read' : ''} ${message.isDelivered ? 'delivered' : ''} ${className}`}
        title={getStatus()}
        {...props}
      >
        <span className="strive-chat-messages-status-icon">{getStatusIcon()}</span>
        <span className="strive-chat-messages-status-text">{getStatus()}</span>
      </Component>
    );
  }
);

Status.displayName = 'ChatMessages.Status';

// ReplyTo component
const ReplyTo = forwardRef<HTMLDivElement, ChatMessagesReplyToProps>(
  ({ as: Component = 'div', message, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-reply-to ${className}`}
        {...props}
      >
        <div className="strive-chat-messages-reply-to-name">
          {message.user.name}
        </div>
        <div className="strive-chat-messages-reply-to-content">
          {message.isDeleted ? 'This message has been deleted' : message.content}
        </div>
      </Component>
    );
  }
);

ReplyTo.displayName = 'ChatMessages.ReplyTo';

// Actions component
const Actions = forwardRef<HTMLDivElement, ChatMessagesActionsProps>(
  ({ as: Component = 'div', message, children, className = '', ...props }, ref) => {
    const { currentUser } = useChatMessagesContext();
    const isCurrentUser = message.user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-actions ${className}`}
        {...props}
      >
        {children || (
          <>
            <Action action="reply" message={message}>
              Reply
            </Action>
            
            <Action action="react" message={message}>
              React
            </Action>
            
            {isCurrentUser && !message.isDeleted && (
              <>
                <Action action="edit" message={message}>
                  Edit
                </Action>
                
                <Action action="delete" message={message}>
                  Delete
                </Action>
              </>
            )}
          </>
        )}
      </Component>
    );
  }
);

Actions.displayName = 'ChatMessages.Actions';

// Action component
const Action = forwardRef<HTMLButtonElement, ChatMessagesActionProps>(
  ({ as: Component = 'button', action, message, children, className = '', ...props }, ref) => {
    const { 
      setReplyingTo, 
      setEditingMessage, 
      deleteMessage,
      addReaction
    } = useChatMessagesContext();
    
    const handleClick = async () => {
      switch (action) {
        case 'reply':
          setReplyingTo(message);
          break;
        case 'edit':
          setEditingMessage(message);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteMessage(message);
          }
          break;
        case 'react':
          // This would typically open a reaction picker
          // For simplicity, we'll just add a default reaction
          addReaction(message, '👍');
          break;
      }
      
      if (props.onClick) {
        props.onClick(new MouseEvent('click') as any);
      }
    };
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-chat-messages-action strive-chat-messages-action-${action} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Action.displayName = 'ChatMessages.Action';

// TypingIndicator component
const TypingIndicator = forwardRef<HTMLDivElement, ChatMessagesTypingIndicatorProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { typingUsers } = useChatMessagesContext();
    
    if (typingUsers.length === 0) {
      return null;
    }
    
    // Format typing message
    const getTypingMessage = () => {
      if (typingUsers.length === 1) {
        return `${typingUsers[0].name} is typing...`;
      } else if (typingUsers.length === 2) {
        return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`;
      } else {
        return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`;
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-typing-indicator ${className}`}
        {...props}
      >
        {children || (
          <>
            <div className="strive-chat-messages-typing-dots">
              <span className="strive-chat-messages-typing-dot"></span>
              <span className="strive-chat-messages-typing-dot"></span>
              <span className="strive-chat-messages-typing-dot"></span>
            </div>
            <div className="strive-chat-messages-typing-text">
              {getTypingMessage()}
            </div>
          </>
        )}
      </Component>
    );
  }
);

TypingIndicator.displayName = 'ChatMessages.TypingIndicator';

// Input component
const Input = forwardRef<HTMLTextAreaElement, ChatMessagesInputProps>(
  ({ 
    as: Component = 'textarea', 
    className = '', 
    placeholder = 'Type a message...', 
    autoFocus = true,
    autoResize = true,
    maxRows = 5,
    submitOnEnter = true,
    onChange,
    onSubmit,
    ...props 
  }, ref) => {
    const { sendMessage, replyingTo, editingMessage, setEditingMessage } = useChatMessagesContext();
    const [value, setValue] = useState(editingMessage ? editingMessage.content : '');
    
    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      
      if (onChange) {
        onChange(e.target.value);
      }
    };
    
    // Handle key press
    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (submitOnEnter && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };
    
    // Handle submit
    const handleSubmit = async () => {
      const trimmedValue = value.trim();
      
      if (!trimmedValue) return;
      
      try {
        if (editingMessage) {
          await sendMessage(trimmedValue);
          setEditingMessage(null);
        } else {
          await sendMessage(trimmedValue, undefined, replyingTo || undefined);
        }
        
        setValue('');
        
        if (onSubmit) {
          onSubmit(trimmedValue);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };
    
    // Use a separate internal ref for our logic
    const internalRef = useRef<HTMLTextAreaElement>(null);
    
    return (
      <div className="strive-chat-messages-input-container">
        {replyingTo && (
          <div className="strive-chat-messages-input-reply-to">
            <div className="strive-chat-messages-input-reply-to-label">
              Replying to {replyingTo.user.name}
            </div>
            <div className="strive-chat-messages-input-reply-to-content">
              {replyingTo.content}
            </div>
            <button 
              type="button" 
              className="strive-chat-messages-input-reply-to-cancel"
              onClick={() => {
                const { setReplyingTo } = useChatMessagesContext();
                setReplyingTo(null);
              }}
            >
              ×
            </button>
          </div>
        )}
        
        {editingMessage && (
          <div className="strive-chat-messages-input-editing">
            <div className="strive-chat-messages-input-editing-label">
              Editing message
            </div>
            <button 
              type="button" 
              className="strive-chat-messages-input-editing-cancel"
              onClick={() => setEditingMessage(null)}
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="strive-chat-messages-input-wrapper">
          <Component
            ref={ref}
            className={`strive-chat-messages-input ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoFocus={autoFocus}
            rows={1}
            {...props}
          />
          
          <button 
            type="button" 
            className="strive-chat-messages-input-submit"
            onClick={handleSubmit}
            disabled={!value.trim()}
          >
            Send
          </button>
        </div>
      </div>
    );
  }
);

Input.displayName = 'ChatMessages.Input';

// AttachButton component
const AttachButton = forwardRef<HTMLButtonElement, ChatMessagesAttachButtonProps>(
  ({ 
    as: Component = 'button', 
    children, 
    className = '', 
    accept = '*',
    maxSize,
    maxFiles,
    onAttach,
    ...props 
  }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleClick = () => {
      fileInputRef.current?.click();
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      
      if (maxFiles && files.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      
      if (maxSize) {
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
          alert(`Some files exceed the maximum size of ${formatFileSize(maxSize)}.`);
          return;
        }
      }
      
      if (onAttach) {
        onAttach(files);
      }
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    // Format file size
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    };
    
    return (
      <>
        <Component
          ref={ref}
          type="button"
          className={`strive-chat-messages-attach-button ${className}`}
          onClick={handleClick}
          {...props}
        >
          {children || 'Attach'}
        </Component>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles !== 1}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </>
    );
  }
);

AttachButton.displayName = 'ChatMessages.AttachButton';

// SendButton component
const SendButton = forwardRef<HTMLButtonElement, ChatMessagesSendButtonProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-chat-messages-send-button ${className}`}
        {...props}
      >
        {children || 'Send'}
      </Component>
    );
  }
);

SendButton.displayName = 'ChatMessages.SendButton';

// LoadMore component
const LoadMore = forwardRef<HTMLButtonElement, ChatMessagesLoadMoreProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const { loadMoreMessages, isLoadingMore, hasMoreMessages } = useChatMessagesContext();
    
    if (!hasMoreMessages) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-chat-messages-load-more ${className}`}
        onClick={loadMoreMessages}
        disabled={isLoadingMore}
        {...props}
      >
        {children || (isLoadingMore ? 'Loading...' : 'Load earlier messages')}
      </Component>
    );
  }
);

LoadMore.displayName = 'ChatMessages.LoadMore';

// Empty component
const Empty = forwardRef<HTMLDivElement, ChatMessagesEmptyProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { messages } = useChatMessagesContext();
    
    if (messages.length > 0) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-empty ${className}`}
        {...props}
      >
        {children || 'No messages yet.'}
      </Component>
    );
  }
);

Empty.displayName = 'ChatMessages.Empty';

// Loading component
const Loading = forwardRef<HTMLDivElement, ChatMessagesLoadingProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { isLoadingMore } = useChatMessagesContext();
    
    if (!isLoadingMore) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-chat-messages-loading ${className}`}
        {...props}
      >
        {children || 'Loading messages...'}
      </Component>
    );
  }
);

Loading.displayName = 'ChatMessages.Loading';

// Consumer component for accessing the context in render props pattern
const Consumer = ({ children }: { children: (context: UseChatMessagesReturn) => React.ReactNode }) => {
  const context = useChatMessagesContext();
  return <>{children(context)}</>;
};

Consumer.displayName = 'ChatMessages.Consumer';

export {
  Content,
  Attachments,
  Attachment,
  Reactions,
  Reaction,
  Timestamp,
  Status,
  ReplyTo,
  Actions,
  Action,
  TypingIndicator,
  Input,
  AttachButton,
  SendButton,
  LoadMore,
  Empty,
  Loading,
  Consumer
};

