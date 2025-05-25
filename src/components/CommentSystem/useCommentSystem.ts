import { useState, useCallback, useMemo } from 'react';

export interface CommentUser {
  /**
   * Unique identifier for the user
   */
  id: string | number;
  
  /**
   * The name of the user
   */
  name: string;
  
  /**
   * The avatar URL of the user
   */
  avatarUrl?: string;
  
  /**
   * Whether the user is the current user
   */
  isCurrentUser?: boolean;
  
  /**
   * The role or title of the user
   */
  role?: string;
  
  /**
   * Custom metadata for the user
   */
  metadata?: Record<string, any>;
}

export interface CommentReaction {
  /**
   * The type of reaction (emoji or text)
   */
  type: string;
  
  /**
   * The user who reacted
   */
  user: CommentUser;
  
  /**
   * The timestamp of the reaction
   */
  timestamp: Date | string;
}

export interface Comment {
  /**
   * Unique identifier for the comment
   */
  id: string | number;
  
  /**
   * The content of the comment
   */
  content: string;
  
  /**
   * The user who posted the comment
   */
  user: CommentUser;
  
  /**
   * The timestamp when the comment was posted
   */
  timestamp: Date | string;
  
  /**
   * Parent comment ID for replies
   */
  parentId?: string | number | null;
  
  /**
   * Reactions to the comment
   */
  reactions?: CommentReaction[];
  
  /**
   * Whether the comment has been edited
   */
  isEdited?: boolean;
  
  /**
   * The timestamp when the comment was edited
   */
  editedTimestamp?: Date | string;
  
  /**
   * Whether the comment has been deleted
   */
  isDeleted?: boolean;
  
  /**
   * Whether the comment is pinned
   */
  isPinned?: boolean;
  
  /**
   * Whether the comment is featured
   */
  isFeatured?: boolean;
  
  /**
   * Whether the comment is flagged
   */
  isFlagged?: boolean;
  
  /**
   * Custom metadata for the comment
   */
  metadata?: Record<string, any>;
}

export interface UseCommentSystemOptions {
  /**
   * Initial list of comments
   * @default []
   */
  initialComments?: Comment[];
  
  /**
   * The current user
   */
  currentUser?: CommentUser;
  
  /**
   * Initial sort order
   * @default 'newest'
   */
  initialSortOrder?: 'newest' | 'oldest' | 'popular' | 'threaded';
  
  /**
   * Initial page size
   * @default 10
   */
  initialPageSize?: number;
  
  /**
   * Whether to enable infinite scrolling
   * @default false
   */
  infiniteScroll?: boolean;
  
  /**
   * Whether to enable threading (replies)
   * @default true
   */
  threading?: boolean;
  
  /**
   * Maximum nesting level for threaded comments
   * @default 3
   */
  maxThreadDepth?: number;
  
  /**
   * Callback when a comment is added
   */
  onAddComment?: (content: string, parentId?: string | number | null) => Promise<Comment>;
  
  /**
   * Callback when a comment is edited
   */
  onEditComment?: (comment: Comment, newContent: string) => Promise<Comment>;
  
  /**
   * Callback when a comment is deleted
   */
  onDeleteComment?: (comment: Comment) => Promise<boolean>;
  
  /**
   * Callback when a reaction is added to a comment
   */
  onAddReaction?: (comment: Comment, reaction: string) => Promise<CommentReaction>;
  
  /**
   * Callback when a reaction is removed from a comment
   */
  onRemoveReaction?: (comment: Comment, reaction: string) => Promise<boolean>;
  
  /**
   * Callback when a comment is flagged
   */
  onFlagComment?: (comment: Comment, reason?: string) => Promise<boolean>;
  
  /**
   * Callback when a comment is pinned or unpinned
   */
  onPinComment?: (comment: Comment, isPinned: boolean) => Promise<boolean>;
  
  /**
   * Callback when more comments are loaded
   */
  onLoadMoreComments?: (page: number, sortOrder: string) => Promise<Comment[]>;
}

export interface UseCommentSystemReturn {
  /**
   * The current list of comments
   */
  comments: Comment[];
  
  /**
   * The current user
   */
  currentUser?: CommentUser;
  
  /**
   * Add a new comment
   */
  addComment: (content: string, parentId?: string | number | null) => Promise<Comment>;
  
  /**
   * Edit an existing comment
   */
  editComment: (comment: Comment, newContent: string) => Promise<Comment>;
  
  /**
   * Delete a comment
   */
  deleteComment: (comment: Comment) => Promise<boolean>;
  
  /**
   * Add a reaction to a comment
   */
  addReaction: (comment: Comment, reaction: string) => Promise<CommentReaction | undefined>;
  
  /**
   * Remove a reaction from a comment
   */
  removeReaction: (comment: Comment, reaction: string) => Promise<boolean>;
  
  /**
   * Flag a comment
   */
  flagComment: (comment: Comment, reason?: string) => Promise<boolean>;
  
  /**
   * Pin or unpin a comment
   */
  pinComment: (comment: Comment, isPinned: boolean) => Promise<boolean>;
  
  /**
   * The current sort order
   */
  sortOrder: 'newest' | 'oldest' | 'popular' | 'threaded';
  
  /**
   * Set the sort order
   */
  setSortOrder: (sortOrder: 'newest' | 'oldest' | 'popular' | 'threaded') => void;
  
  /**
   * The current page
   */
  page: number;
  
  /**
   * The current page size
   */
  pageSize: number;
  
  /**
   * Whether there are more comments to load
   */
  hasMore: boolean;
  
  /**
   * Whether comments are currently loading
   */
  isLoading: boolean;
  
  /**
   * Load more comments
   */
  loadMore: () => Promise<void>;
  
  /**
   * The comment being edited
   */
  editingComment: Comment | null;
  
  /**
   * Set the comment being edited
   */
  setEditingComment: (comment: Comment | null) => void;
  
  /**
   * The comment being replied to
   */
  replyingTo: Comment | null;
  
  /**
   * Set the comment being replied to
   */
  setReplyingTo: (comment: Comment | null) => void;
  
  /**
   * Total number of comments (including replies)
   */
  totalComments: number;
  
  /**
   * Total number of top-level comments (excluding replies)
   */
  totalTopLevelComments: number;
  
  /**
   * Get replies for a comment
   */
  getReplies: (commentId: string | number) => Comment[];
  
  /**
   * Structured comments for threaded display
   */
  threadedComments: {
    comment: Comment;
    replies: Comment[];
    depth: number;
  }[];
}

/**
 * Hook for managing a comment system with threading, reactions, and pagination
 */
export function useCommentSystem(options: UseCommentSystemOptions = {}): UseCommentSystemReturn {
  const {
    initialComments = [],
    currentUser,
    initialSortOrder = 'newest',
    initialPageSize = 10,
    infiniteScroll = false,
    threading = true,
    maxThreadDepth = 3,
    onAddComment,
    onEditComment,
    onDeleteComment,
    onAddReaction,
    onRemoveReaction,
    onFlagComment,
    onPinComment,
    onLoadMoreComments,
  } = options;
  
  // State
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular' | 'threaded'>(initialSortOrder);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  
  // Calculate total comments
  const totalComments = useMemo(() => comments.length, [comments]);
  
  // Calculate total top-level comments
  const totalTopLevelComments = useMemo(() => 
    comments.filter(comment => !comment.parentId).length, 
    [comments]
  );
  
  // Get replies for a comment
  const getReplies = useCallback((commentId: string | number): Comment[] => {
    return comments.filter(comment => comment.parentId === commentId);
  }, [comments]);
  
  // Build threaded comments structure
  const threadedComments = useMemo(() => {
    if (!threading) {
      // If threading is disabled, treat all comments as top-level
      return comments.map(comment => ({
        comment,
        replies: [],
        depth: 0
      }));
    }
    
    // Helper function to build the thread structure recursively
    const buildThreads = (
      parentId: string | number | null | undefined = null,
      depth: number = 0
    ): {
      comment: Comment;
      replies: Comment[];
      depth: number;
    }[] => {
      // Get comments at this level
      const commentsAtLevel = comments.filter(c => c.parentId === parentId);
      
      // Sort comments based on sort order
      const sortedComments = [...commentsAtLevel].sort((a, b) => {
        switch (sortOrder) {
          case 'newest':
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          case 'oldest':
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          case 'popular':
            const aPopularity = (a.reactions?.length || 0);
            const bPopularity = (b.reactions?.length || 0);
            return bPopularity - aPopularity;
          case 'threaded':
            // For threaded, we'll keep the default order (usually by ID or timestamp)
            return 0;
          default:
            return 0;
        }
      });
      
      // Build thread structure for each comment
      return sortedComments.map(comment => {
        // Only get replies if we haven't reached max depth
        const replies = depth < maxThreadDepth 
          ? getReplies(comment.id)
          : [];
        
        return {
          comment,
          replies,
          depth
        };
      });
    };
    
    // Start building from top-level comments
    const result = buildThreads();
    
    // For non-threaded sort orders, flatten the structure
    if (sortOrder !== 'threaded') {
      const flattenedComments: {
        comment: Comment;
        replies: Comment[];
        depth: number;
      }[] = [];
      
      // Helper function to flatten the thread structure
      const flatten = (
        threads: {
          comment: Comment;
          replies: Comment[];
          depth: number;
        }[],
        depth: number = 0
      ) => {
        threads.forEach(thread => {
          flattenedComments.push({
            comment: thread.comment,
            replies: [],
            depth
          });
          
          if (thread.replies.length > 0) {
            flatten(
              thread.replies.map(reply => ({
                comment: reply,
                replies: getReplies(reply.id),
                depth: depth + 1
              })),
              depth + 1
            );
          }
        });
      };
      
      flatten(result);
      
      // Sort the flattened comments
      flattenedComments.sort((a, b) => {
        switch (sortOrder) {
          case 'newest':
            return new Date(b.comment.timestamp).getTime() - new Date(a.comment.timestamp).getTime();
          case 'oldest':
            return new Date(a.comment.timestamp).getTime() - new Date(b.comment.timestamp).getTime();
          case 'popular':
            const aPopularity = (a.comment.reactions?.length || 0);
            const bPopularity = (b.comment.reactions?.length || 0);
            return bPopularity - aPopularity;
          default:
            return 0;
        }
      });
      
      return flattenedComments;
    }
    
    return result;
  }, [comments, getReplies, maxThreadDepth, sortOrder, threading]);
  
  // Add a new comment
  const addComment = useCallback(async (
    content: string,
    parentId?: string | number | null
  ): Promise<Comment> => {
    if (!content.trim()) {
      throw new Error('Comment content cannot be empty');
    }
    
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    try {
      // Send the comment to the server
      if (onAddComment) {
        const newComment = await onAddComment(content, parentId);
        
        // Add the new comment to the list
        setComments(prev => [...prev, newComment]);
        
        // Clear the replying to state
        setReplyingTo(null);
        
        return newComment;
      }
      
      // If no onAddComment callback is provided, create a local comment
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        user: currentUser,
        timestamp: new Date(),
        parentId: parentId || null,
      };
      
      setComments(prev => [...prev, newComment]);
      setReplyingTo(null);
      
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, [currentUser, onAddComment]);
  
  // Edit a comment
  const editComment = useCallback(async (
    comment: Comment,
    newContent: string
  ): Promise<Comment> => {
    if (!newContent.trim()) {
      throw new Error('Comment content cannot be empty');
    }
    
    if (comment.user.id !== currentUser?.id) {
      throw new Error('Cannot edit a comment from another user');
    }
    
    // Update the comment locally
    const updatedComment: Comment = {
      ...comment,
      content: newContent,
      isEdited: true,
      editedTimestamp: new Date(),
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? updatedComment : c
    ));
    
    try {
      // Send the edit to the server
      if (onEditComment) {
        const editedComment = await onEditComment(comment, newContent);
        
        // Update the comment with the response from the server
        setComments(prev => prev.map(c => 
          c.id === comment.id ? editedComment : c
        ));
        
        setEditingComment(null);
        
        return editedComment;
      }
      
      setEditingComment(null);
      
      return updatedComment;
    } catch (error) {
      // Revert the edit on error
      setComments(prev => prev.map(c => 
        c.id === comment.id ? comment : c
      ));
      
      console.error('Error editing comment:', error);
      throw error;
    }
  }, [currentUser, onEditComment]);
  
  // Delete a comment
  const deleteComment = useCallback(async (comment: Comment): Promise<boolean> => {
    if (comment.user.id !== currentUser?.id) {
      throw new Error('Cannot delete a comment from another user');
    }
    
    // Mark the comment as deleted locally
    const deletedComment: Comment = {
      ...comment,
      isDeleted: true,
      content: 'This comment has been deleted',
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? deletedComment : c
    ));
    
    try {
      // Send the delete to the server
      if (onDeleteComment) {
        const success = await onDeleteComment(comment);
        
        if (!success) {
          // Revert the delete on error
          setComments(prev => prev.map(c => 
            c.id === comment.id ? comment : c
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the delete on error
      setComments(prev => prev.map(c => 
        c.id === comment.id ? comment : c
      ));
      
      console.error('Error deleting comment:', error);
      throw error;
    }
  }, [currentUser, onDeleteComment]);
  
  // Add a reaction to a comment
  const addReaction = useCallback(async (
    comment: Comment,
    reaction: string
  ): Promise<CommentReaction | undefined> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Check if the user has already added this reaction
    const hasReaction = comment.reactions?.some(
      r => r.user.id === currentUser.id && r.type === reaction
    );
    
    if (hasReaction) {
      return;
    }
    
    // Create a temporary reaction
    const tempReaction: CommentReaction = {
      type: reaction,
      user: currentUser,
      timestamp: new Date(),
    };
    
    // Add the reaction locally
    const updatedComment: Comment = {
      ...comment,
      reactions: [...(comment.reactions || []), tempReaction],
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? updatedComment : c
    ));
    
    try {
      // Send the reaction to the server
      if (onAddReaction) {
        const serverReaction = await onAddReaction(comment, reaction);
        
        // Update the comment with the response from the server
        setComments(prev => prev.map(c => {
          if (c.id !== comment.id) return c;
          
          const reactions = [...(c.reactions || [])];
          const tempIndex = reactions.findIndex(
            r => r.user.id === currentUser.id && r.type === reaction && !r.timestamp
          );
          
          if (tempIndex !== -1) {
            reactions[tempIndex] = serverReaction;
          }
          
          return {
            ...c,
            reactions,
          };
        }));
        
        return serverReaction;
      }
      
      return tempReaction;
    } catch (error) {
      // Remove the reaction on error
      setComments(prev => prev.map(c => {
        if (c.id !== comment.id) return c;
        
        return {
          ...c,
          reactions: (c.reactions || []).filter(
            r => !(r.user.id === currentUser.id && r.type === reaction)
          ),
        };
      }));
      
      console.error('Error adding reaction:', error);
      throw error;
    }
  }, [currentUser, onAddReaction]);
  
  // Remove a reaction from a comment
  const removeReaction = useCallback(async (
    comment: Comment,
    reaction: string
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Check if the user has added this reaction
    const hasReaction = comment.reactions?.some(
      r => r.user.id === currentUser.id && r.type === reaction
    );
    
    if (!hasReaction) {
      return false;
    }
    
    // Remove the reaction locally
    const updatedComment: Comment = {
      ...comment,
      reactions: (comment.reactions || []).filter(
        r => !(r.user.id === currentUser.id && r.type === reaction)
      ),
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? updatedComment : c
    ));
    
    try {
      // Send the removal to the server
      if (onRemoveReaction) {
        const success = await onRemoveReaction(comment, reaction);
        
        if (!success) {
          // Revert the removal on error
          setComments(prev => prev.map(c => 
            c.id === comment.id ? comment : c
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the removal on error
      setComments(prev => prev.map(c => 
        c.id === comment.id ? comment : c
      ));
      
      console.error('Error removing reaction:', error);
      throw error;
    }
  }, [currentUser, onRemoveReaction]);
  
  // Flag a comment
  const flagComment = useCallback(async (
    comment: Comment,
    reason?: string
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Mark the comment as flagged locally
    const flaggedComment: Comment = {
      ...comment,
      isFlagged: true,
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? flaggedComment : c
    ));
    
    try {
      // Send the flag to the server
      if (onFlagComment) {
        const success = await onFlagComment(comment, reason);
        
        if (!success) {
          // Revert the flag on error
          setComments(prev => prev.map(c => 
            c.id === comment.id ? comment : c
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the flag on error
      setComments(prev => prev.map(c => 
        c.id === comment.id ? comment : c
      ));
      
      console.error('Error flagging comment:', error);
      throw error;
    }
  }, [currentUser, onFlagComment]);
  
  // Pin or unpin a comment
  const pinComment = useCallback(async (
    comment: Comment,
    isPinned: boolean
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Update the comment locally
    const updatedComment: Comment = {
      ...comment,
      isPinned,
    };
    
    setComments(prev => prev.map(c => 
      c.id === comment.id ? updatedComment : c
    ));
    
    try {
      // Send the pin status to the server
      if (onPinComment) {
        const success = await onPinComment(comment, isPinned);
        
        if (!success) {
          // Revert the pin status on error
          setComments(prev => prev.map(c => 
            c.id === comment.id ? comment : c
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the pin status on error
      setComments(prev => prev.map(c => 
        c.id === comment.id ? comment : c
      ));
      
      console.error('Error pinning comment:', error);
      throw error;
    }
  }, [currentUser, onPinComment]);
  
  // Load more comments
  const loadMore = useCallback(async (): Promise<void> => {
    if (isLoading || !hasMore || !onLoadMoreComments) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const nextPage = page + 1;
      const newComments = await onLoadMoreComments(nextPage, sortOrder);
      
      if (newComments.length === 0) {
        setHasMore(false);
      } else {
        setComments(prev => [...prev, ...newComments]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, sortOrder, onLoadMoreComments]);
  
  return {
    comments,
    currentUser,
    addComment,
    editComment,
    deleteComment,
    addReaction,
    removeReaction,
    flagComment,
    pinComment,
    sortOrder,
    setSortOrder,
    page,
    pageSize,
    hasMore,
    isLoading,
    loadMore,
    editingComment,
    setEditingComment,
    replyingTo,
    setReplyingTo,
    totalComments,
    totalTopLevelComments,
    getReplies,
    threadedComments,
  };
}

export default useCommentSystem;
