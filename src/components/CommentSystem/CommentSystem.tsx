import React, { createContext, useContext, forwardRef } from 'react';
import useCommentSystem, { 
  UseCommentSystemOptions, 
  UseCommentSystemReturn, 
  Comment, 
  CommentUser,
  CommentReaction
} from './useCommentSystem';

// Create context for the comment system
export const CommentSystemContext = createContext<UseCommentSystemReturn | null>(null);

// Hook to use comment system context
export const useCommentSystemContext = () => {
  const context = useContext(CommentSystemContext);
  if (!context) {
    throw new Error('useCommentSystemContext must be used within a CommentSystem.Root component');
  }
  return context;
};

// Types for the compound components
export interface CommentSystemRootProps extends React.HTMLAttributes<HTMLDivElement>, UseCommentSystemOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the list container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemThreadProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the thread container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The thread data
   */
  thread: {
    comment: Comment;
    replies: Comment[];
    depth: number;
  };
}

export interface CommentSystemItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the comment container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The comment data
   */
  comment: Comment;
  
  /**
   * The depth level of the comment
   * @default 0
   */
  depth?: number;
}

export interface CommentSystemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the comment content
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemAuthorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the author container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The user data
   */
  user: CommentUser;
}

export interface CommentSystemAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The component used for the avatar
   * @default 'img'
   */
  as?: React.ElementType;
  
  /**
   * The user data
   */
  user: CommentUser;
  
  /**
   * Fallback for when avatar URL is not available
   * @default true
   */
  showFallback?: boolean;
}

export interface CommentSystemMetadataProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the metadata container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemTimestampProps extends React.HTMLAttributes<HTMLTimeElement> {
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

export interface CommentSystemReactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the reactions container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemReactionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
   * The comment to react to
   */
  comment: Comment;
  
  /**
   * The count of this reaction
   */
  count: number;
  
  /**
   * Whether the current user has reacted with this reaction
   */
  hasReacted: boolean;
}

export interface CommentSystemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the actions container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The comment to show actions for
   */
  comment: Comment;
}

export interface CommentSystemActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the action button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * The action type
   */
  action: 'reply' | 'edit' | 'delete' | 'flag' | 'pin' | 'react';
  
  /**
   * The comment to perform the action on
   */
  comment: Comment;
}

export interface CommentSystemFormProps extends React.HTMLAttributes<HTMLFormElement> {
  /**
   * The component used for the form
   * @default 'form'
   */
  as?: React.ElementType;
  
  /**
   * The parent comment ID for replies
   */
  parentId?: string | number | null;
  
  /**
   * Placeholder text for the input
   * @default 'Write a comment...'
   */
  placeholder?: string;
  
  /**
   * Submit button text
   * @default 'Post'
   */
  submitText?: string;
  
  /**
   * Cancel button text (for editing/replying)
   * @default 'Cancel'
   */
  cancelText?: string;
  
  /**
   * Whether to auto focus the input
   * @default false
   */
  autoFocus?: boolean;
}

export interface CommentSystemSortProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * The component used for the sort select
   * @default 'select'
   */
  as?: React.ElementType;
}

export interface CommentSystemLoadMoreProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the load more button
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface CommentSystemEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the empty state container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface CommentSystemLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the loading state container
   * @default 'div'
   */
  as?: React.ElementType;
}

// Root component
const Root = forwardRef<HTMLDivElement, CommentSystemRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract comment system options from props
    const {
      initialComments,
      currentUser,
      initialSortOrder,
      initialPageSize,
      infiniteScroll,
      threading,
      maxThreadDepth,
      onAddComment,
      onEditComment,
      onDeleteComment,
      onAddReaction,
      onRemoveReaction,
      onFlagComment,
      onPinComment,
      onLoadMoreComments,
      ...restProps
    } = props;
    
    // Use the comment system hook
    const commentSystemState = useCommentSystem({
      initialComments,
      currentUser,
      initialSortOrder,
      initialPageSize,
      infiniteScroll,
      threading,
      maxThreadDepth,
      onAddComment,
      onEditComment,
      onDeleteComment,
      onAddReaction,
      onRemoveReaction,
      onFlagComment,
      onPinComment,
      onLoadMoreComments,
    });
    
    return (
      <CommentSystemContext.Provider value={commentSystemState}>
        <Component
          ref={ref}
          className={`strive-comment-system ${className}`}
          {...restProps}
        >
          {children}
        </Component>
      </CommentSystemContext.Provider>
    );
  }
);

Root.displayName = 'CommentSystem.Root';

// List component
const List = forwardRef<HTMLDivElement, CommentSystemListProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { threadedComments, totalComments } = useCommentSystemContext();
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-list ${className}`}
        aria-label={`Comments (${totalComments})`}
        {...props}
      >
        {children || (
          <>
            {threadedComments.map((thread, index) => (
              <Thread key={`${thread.comment.id}-${index}`} thread={thread} />
            ))}
          </>
        )}
      </Component>
    );
  }
);

List.displayName = 'CommentSystem.List';

// Thread component
const Thread = forwardRef<HTMLDivElement, CommentSystemThreadProps>(
  ({ as: Component = 'div', thread, children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-thread depth-${thread.depth} ${className}`}
        {...props}
      >
        {children || (
          <>
            <Item comment={thread.comment} depth={thread.depth} />
            
            {thread.replies.length > 0 && (
              <div className="strive-comment-system-replies">
                {thread.replies.map((reply) => (
                  <Item key={reply.id} comment={reply} depth={thread.depth + 1} />
                ))}
              </div>
            )}
          </>
        )}
      </Component>
    );
  }
);

Thread.displayName = 'CommentSystem.Thread';

// Item component
const Item = forwardRef<HTMLDivElement, CommentSystemItemProps>(
  ({ as: Component = 'div', comment, depth = 0, children, className = '', ...props }, ref) => {
    const { currentUser } = useCommentSystemContext();
    const isCurrentUser = comment.user.id === currentUser?.id;
    
    return (
      <Component
        ref={ref}
        className={`strive-comment-system-item depth-${depth} ${isCurrentUser ? 'current-user' : ''} ${comment.isPinned ? 'pinned' : ''} ${comment.isFeatured ? 'featured' : ''} ${comment.isDeleted ? 'deleted' : ''} ${className}`}
        {...props}
      >
        {children || (
          <>
            <Avatar user={comment.user} />
            
            <div className="strive-comment-system-item-body">
              <Author user={comment.user} />
              
              <Content>{comment.content}</Content>
              
              {comment.reactions && comment.reactions.length > 0 && (
                <Reactions>
                  {/* Group reactions by type */}
                  {Object.entries(
                    comment.reactions.reduce<Record<string, { count: number; users: CommentUser[] }>>(
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
                      comment={comment}
                      count={count}
                      hasReacted={users.some(user => user.id === currentUser?.id)}
                    />
                  ))}
                </Reactions>
              )}
              
              <Metadata>
                <Timestamp>{comment.timestamp.toString()}</Timestamp>
                
                {comment.isEdited && (
                  <span className="strive-comment-system-edited">
                    (Edited)
                  </span>
                )}
              </Metadata>
              
              <Actions comment={comment} />
            </div>
          </>
        )}
      </Component>
    );
  }
);

Item.displayName = 'CommentSystem.Item';

// Import additional components
import {
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
} from './CommentSystemComponents';

// Export the components
export const CommentSystem = {
  Root,
  List,
  Thread,
  Item,
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

export default CommentSystem;
