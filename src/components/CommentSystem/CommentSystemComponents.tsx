import React, { forwardRef, useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useCommentSystemContext } from './CommentSystem';
import { UseCommentSystemReturn } from './useCommentSystem';
import type { 
  CommentSystemContentProps,
  CommentSystemAuthorProps,
  CommentSystemAvatarProps,
  CommentSystemMetadataProps,
  CommentSystemTimestampProps,
  CommentSystemReactionsProps,
  CommentSystemReactionProps,
  CommentSystemActionsProps,
  CommentSystemActionProps,
  CommentSystemFormProps,
  CommentSystemSortProps,
  CommentSystemLoadMoreProps,
  CommentSystemEmptyProps,
  CommentSystemLoadingProps
} from './CommentSystem';

// Content component
const Content = forwardRef<HTMLDivElement, CommentSystemContentProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-content ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'CommentSystem.Content';

// Author component
const Author = forwardRef<HTMLDivElement, CommentSystemAuthorProps>(
  ({ as: Component = 'div', user, children, className = '', ...props }, ref) => {
    const { currentUser } = useCommentSystemContext();
    const isCurrentUser = user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-author ${isCurrentUser ? 'current-user' : ''} ${className}`}
        {...props}
      >
        {children || (
          <>
            <span className="strive-comment-system-author-name">
              {user.name}
            </span>
            
            {user.role && (
              <span className="strive-comment-system-author-role">
                {user.role}
              </span>
            )}
            
            {isCurrentUser && (
              <span className="strive-comment-system-author-you">
                (You)
              </span>
            )}
          </>
        )}
      </Component>
    );
  }
);

Author.displayName = 'CommentSystem.Author';

// Avatar component
const Avatar = forwardRef<HTMLImageElement, CommentSystemAvatarProps>(
  ({ as: Component = 'img', user, showFallback = true, className = '', ...props }, ref) => {
    if (user.avatarUrl) {
      return (
        <Component
          ref={ref}
          src={user.avatarUrl}
          alt={`${user.name}'s avatar`}
          className={`strive-comment-system-avatar ${className}`}
          {...props}
        />
      );
    }
    
    if (showFallback) {
      return (
        <div
          className={`strive-comment-system-avatar-fallback ${className}`}
          title={user.name}
          {...props}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      );
    }
    
    return null;
  }
);

Avatar.displayName = 'CommentSystem.Avatar';

// Metadata component
const Metadata = forwardRef<HTMLDivElement, CommentSystemMetadataProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-metadata ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Metadata.displayName = 'CommentSystem.Metadata';

// Timestamp component
const Timestamp = forwardRef<HTMLTimeElement, CommentSystemTimestampProps>(
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
        className={`strive-comment-system-timestamp ${className}`}
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

Timestamp.displayName = 'CommentSystem.Timestamp';

// Reactions component
const Reactions = forwardRef<HTMLDivElement, CommentSystemReactionsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-reactions ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Reactions.displayName = 'CommentSystem.Reactions';

// Reaction component
const Reaction = forwardRef<HTMLButtonElement, CommentSystemReactionProps>(
  ({ as: Component = 'button', reaction, comment, count, hasReacted, className = '', ...props }, ref) => {
    const { addReaction, removeReaction } = useCommentSystemContext();
    
    const handleClick = () => {
      if (hasReacted) {
        removeReaction(comment, reaction);
      } else {
        addReaction(comment, reaction);
      }
    };
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-comment-system-reaction ${hasReacted ? 'active' : ''} ${className}`}
        onClick={handleClick}
        aria-pressed={hasReacted}
        {...props}
      >
        <span className="strive-comment-system-reaction-emoji">{reaction}</span>
        <span className="strive-comment-system-reaction-count">{count}</span>
      </Component>
    );
  }
);

Reaction.displayName = 'CommentSystem.Reaction';

// Actions component
const Actions = forwardRef<HTMLDivElement, CommentSystemActionsProps>(
  ({ as: Component = 'div', comment, children, className = '', ...props }, ref) => {
    const { currentUser } = useCommentSystemContext();
    const isCurrentUser = comment.user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-actions ${className}`}
        {...props}
      >
        {children || (
          <>
            <Action action="reply" comment={comment}>
              Reply
            </Action>
            
            <Action action="react" comment={comment}>
              React
            </Action>
            
            {isCurrentUser && !comment.isDeleted && (
              <>
                <Action action="edit" comment={comment}>
                  Edit
                </Action>
                
                <Action action="delete" comment={comment}>
                  Delete
                </Action>
              </>
            )}
            
            {!isCurrentUser && (
              <Action action="flag" comment={comment}>
                Flag
              </Action>
            )}
            
            {currentUser?.role === 'admin' && (
              <Action action="pin" comment={comment}>
                {comment.isPinned ? 'Unpin' : 'Pin'}
              </Action>
            )}
          </>
        )}
      </Component>
    );
  }
);

Actions.displayName = 'CommentSystem.Actions';

// Action component
const Action = forwardRef<HTMLButtonElement, CommentSystemActionProps>(
  ({ as: Component = 'button', action, comment, children, className = '', ...props }, ref) => {
    const { 
      setReplyingTo, 
      setEditingComment, 
      deleteComment,
      addReaction,
      flagComment,
      pinComment
    } = useCommentSystemContext();
    
    const handleClick = async () => {
      switch (action) {
        case 'reply':
          setReplyingTo(comment);
          break;
        case 'edit':
          setEditingComment(comment);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this comment?')) {
            await deleteComment(comment);
          }
          break;
        case 'react':
          // This would typically open a reaction picker
          // For simplicity, we'll just add a default reaction
          addReaction(comment, '👍');
          break;
        case 'flag':
          const reason = prompt('Why are you flagging this comment?');
          if (reason) {
            await flagComment(comment, reason);
            alert('Comment has been flagged. Thank you for your feedback.');
          }
          break;
        case 'pin':
          await pinComment(comment, !comment.isPinned);
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
        className={`strive-comment-system-action strive-comment-system-action-${action} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Action.displayName = 'CommentSystem.Action';

// Form component
const Form = forwardRef<HTMLFormElement, CommentSystemFormProps>(
  ({ 
    as: Component = 'form', 
    parentId = null, 
    placeholder = 'Write a comment...', 
    submitText = 'Post', 
    cancelText = 'Cancel', 
    autoFocus = false,
    className = '', 
    ...props 
  }, ref) => {
    const { 
      addComment, 
      editComment, 
      replyingTo, 
      setReplyingTo, 
      editingComment, 
      setEditingComment 
    } = useCommentSystemContext();
    
    const [content, setContent] = useState(editingComment ? editingComment.content : '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Reset form when editing comment changes
    React.useEffect(() => {
      if (editingComment) {
        setContent(editingComment.content);
        textareaRef.current?.focus();
      } else if (!replyingTo) {
        setContent('');
      }
    }, [editingComment, replyingTo]);
    
    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      
      const trimmedContent = content.trim();
      
      if (!trimmedContent) return;
      
      try {
        if (editingComment) {
          await editComment(editingComment, trimmedContent);
          setEditingComment(null);
        } else {
          const effectiveParentId = replyingTo ? replyingTo.id : parentId;
          await addComment(trimmedContent, effectiveParentId);
          setReplyingTo(null);
        }
        
        setContent('');
      } catch (error) {
        console.error('Error submitting comment:', error);
        alert('Failed to submit comment. Please try again.');
      }
    };
    
    // Handle cancel
    const handleCancel = () => {
      if (editingComment) {
        setEditingComment(null);
      } else if (replyingTo) {
        setReplyingTo(null);
      }
      
      setContent('');
    };
    
    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-form ${replyingTo ? 'replying' : ''} ${editingComment ? 'editing' : ''} ${className}`}
        onSubmit={handleSubmit}
        {...props}
      >
        {replyingTo && (
          <div className="strive-comment-system-form-replying-to">
            <div className="strive-comment-system-form-replying-to-label">
              Replying to {replyingTo.user.name}
            </div>
            <button 
              type="button" 
              className="strive-comment-system-form-replying-to-cancel"
              onClick={() => setReplyingTo(null)}
            >
              ×
            </button>
          </div>
        )}
        
        {editingComment && (
          <div className="strive-comment-system-form-editing">
            <div className="strive-comment-system-form-editing-label">
              Editing comment
            </div>
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          className="strive-comment-system-form-textarea"
          placeholder={placeholder}
          value={content}
          onChange={handleChange}
          autoFocus={autoFocus}
          rows={3}
        />
        
        <div className="strive-comment-system-form-actions">
          {(replyingTo || editingComment) && (
            <button 
              type="button" 
              className="strive-comment-system-form-cancel"
              onClick={handleCancel}
            >
              {cancelText}
            </button>
          )}
          
          <button 
            type="submit" 
            className="strive-comment-system-form-submit"
            disabled={!content.trim()}
          >
            {submitText}
          </button>
        </div>
      </Component>
    );
  }
);

Form.displayName = 'CommentSystem.Form';

// Sort component
const Sort = forwardRef<HTMLSelectElement, CommentSystemSortProps>(
  ({ as: Component = 'select', children, className = '', ...props }, ref) => {
    const { sortOrder, setSortOrder } = useCommentSystemContext();
    
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value as any);
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-sort ${className}`}
        value={sortOrder}
        onChange={handleChange}
        {...props}
      >
        {children || (
          <>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
            <option value="threaded">Threaded</option>
          </>
        )}
      </Component>
    );
  }
);

Sort.displayName = 'CommentSystem.Sort';

// LoadMore component
const LoadMore = forwardRef<HTMLButtonElement, CommentSystemLoadMoreProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const { loadMore, isLoading, hasMore } = useCommentSystemContext();
    
    if (!hasMore) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-comment-system-load-more ${className}`}
        onClick={loadMore}
        disabled={isLoading}
        {...props}
      >
        {children || (isLoading ? 'Loading...' : 'Load more comments')}
      </Component>
    );
  }
);

LoadMore.displayName = 'CommentSystem.LoadMore';

// Empty component
const Empty = forwardRef<HTMLDivElement, CommentSystemEmptyProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { comments } = useCommentSystemContext();
    
    if (comments.length > 0) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-empty ${className}`}
        {...props}
      >
        {children || 'No comments yet. Be the first to comment!'}
      </Component>
    );
  }
);

Empty.displayName = 'CommentSystem.Empty';

// Loading component
const Loading = forwardRef<HTMLDivElement, CommentSystemLoadingProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { isLoading } = useCommentSystemContext();
    
    if (!isLoading) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-loading ${className}`}
        {...props}
      >
        {children || 'Loading comments...'}
      </Component>
    );
  }
);

Loading.displayName = 'CommentSystem.Loading';

// Consumer component for accessing the context in render props pattern
const Consumer = ({ children }: { children: (context: UseCommentSystemReturn) => React.ReactNode }) => {
  const context = useCommentSystemContext();
  return <>{children(context)}</>;
};

Consumer.displayName = 'CommentSystem.Consumer';

export {
  Content,
  Author,
  Avatar,
  Metadata,
  Timestamp,
  Reactions,
  Reaction,
  Actions,
  Action,
  Form,
  Sort,
  LoadMore,
  Empty,
  Loading,
  Consumer
};
