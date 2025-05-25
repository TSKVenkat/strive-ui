import { useState, useCallback, useMemo } from 'react';

export interface ChatUser {
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
   * The status of the user (online, offline, away, etc.)
   */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'typing';
  
  /**
   * Last seen timestamp
   */
  lastSeen?: Date | string;
  
  /**
   * Custom metadata for the user
   */
  metadata?: Record<string, any>;
}

export interface ChatAttachment {
  /**
   * Unique identifier for the attachment
   */
  id: string | number;
  
  /**
   * The type of attachment
   */
  type: 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact' | 'other';
  
  /**
   * The URL of the attachment
   */
  url: string;
  
  /**
   * The name of the attachment
   */
  name?: string;
  
  /**
   * The size of the attachment in bytes
   */
  size?: number;
  
  /**
   * The MIME type of the attachment
   */
  mimeType?: string;
  
  /**
   * The thumbnail URL for the attachment
   */
  thumbnailUrl?: string;
  
  /**
   * The width of the attachment (for images and videos)
   */
  width?: number;
  
  /**
   * The height of the attachment (for images and videos)
   */
  height?: number;
  
  /**
   * The duration of the attachment in seconds (for audio and video)
   */
  duration?: number;
  
  /**
   * Custom metadata for the attachment
   */
  metadata?: Record<string, any>;
}

export interface ChatReaction {
  /**
   * The type of reaction (emoji or text)
   */
  type: string;
  
  /**
   * The user who reacted
   */
  user: ChatUser;
  
  /**
   * The timestamp of the reaction
   */
  timestamp: Date | string;
}

export interface ChatMessage {
  /**
   * Unique identifier for the message
   */
  id: string | number;
  
  /**
   * The content of the message
   */
  content: string;
  
  /**
   * The user who sent the message
   */
  user: ChatUser;
  
  /**
   * The timestamp when the message was sent
   */
  timestamp: Date | string;
  
  /**
   * Whether the message has been read
   */
  isRead?: boolean;
  
  /**
   * Whether the message has been delivered
   */
  isDelivered?: boolean;
  
  /**
   * Whether the message is being sent (pending)
   */
  isPending?: boolean;
  
  /**
   * Whether the message failed to send
   */
  isFailed?: boolean;
  
  /**
   * Attachments for the message
   */
  attachments?: ChatAttachment[];
  
  /**
   * Reactions to the message
   */
  reactions?: ChatReaction[];
  
  /**
   * Whether the message has been edited
   */
  isEdited?: boolean;
  
  /**
   * The original content of the message before editing
   */
  originalContent?: string;
  
  /**
   * The timestamp when the message was edited
   */
  editedTimestamp?: Date | string;
  
  /**
   * Whether the message has been deleted
   */
  isDeleted?: boolean;
  
  /**
   * The message that this message is replying to
   */
  replyTo?: ChatMessage;
  
  /**
   * Custom metadata for the message
   */
  metadata?: Record<string, any>;
}

export interface UseChatMessagesOptions {
  /**
   * Initial list of messages
   * @default []
   */
  initialMessages?: ChatMessage[];
  
  /**
   * The current user
   */
  currentUser?: ChatUser;
  
  /**
   * Whether to group messages by user
   * @default true
   */
  groupByUser?: boolean;
  
  /**
   * Maximum time difference in minutes between messages to be grouped
   * @default 2
   */
  groupTimeThreshold?: number;
  
  /**
   * Whether to show timestamps for each message
   * @default false
   */
  showTimestamps?: boolean;
  
  /**
   * Whether to show read receipts
   * @default true
   */
  showReadReceipts?: boolean;
  
  /**
   * Whether to show typing indicators
   * @default true
   */
  showTypingIndicators?: boolean;
  
  /**
   * Callback when a message is sent
   */
  onSendMessage?: (content: string, attachments?: ChatAttachment[], replyTo?: ChatMessage) => Promise<ChatMessage>;
  
  /**
   * Callback when a message is edited
   */
  onEditMessage?: (message: ChatMessage, newContent: string) => Promise<ChatMessage>;
  
  /**
   * Callback when a message is deleted
   */
  onDeleteMessage?: (message: ChatMessage) => Promise<boolean>;
  
  /**
   * Callback when a reaction is added to a message
   */
  onAddReaction?: (message: ChatMessage, reaction: string) => Promise<ChatReaction>;
  
  /**
   * Callback when a reaction is removed from a message
   */
  onRemoveReaction?: (message: ChatMessage, reaction: string) => Promise<boolean>;
  
  /**
   * Callback when a message is read
   */
  onReadMessage?: (message: ChatMessage) => Promise<boolean>;
  
  /**
   * Callback when more messages are loaded
   */
  onLoadMoreMessages?: (before?: Date | string) => Promise<ChatMessage[]>;
}

export interface UseChatMessagesReturn {
  /**
   * The current list of messages
   */
  messages: ChatMessage[];
  
  /**
   * The current user
   */
  currentUser?: ChatUser;
  
  /**
   * Send a new message
   */
  sendMessage: (content: string, attachments?: ChatAttachment[], replyTo?: ChatMessage) => Promise<ChatMessage>;
  
  /**
   * Edit an existing message
   */
  editMessage: (message: ChatMessage, newContent: string) => Promise<ChatMessage>;
  
  /**
   * Delete a message
   */
  deleteMessage: (message: ChatMessage) => Promise<boolean>;
  
  /**
   * Add a reaction to a message
   */
  addReaction: (message: ChatMessage, reaction: string) => Promise<ChatReaction | undefined>;
  
  /**
   * Remove a reaction from a message
   */
  removeReaction: (message: ChatMessage, reaction: string) => Promise<boolean>;
  
  /**
   * Mark a message as read
   */
  markAsRead: (message: ChatMessage) => Promise<boolean>;
  
  /**
   * Load more messages
   */
  loadMoreMessages: () => Promise<ChatMessage[]>;
  
  /**
   * Whether more messages are being loaded
   */
  isLoadingMore: boolean;
  
  /**
   * Whether there are more messages to load
   */
  hasMoreMessages: boolean;
  
  /**
   * The message being replied to
   */
  replyingTo: ChatMessage | null;
  
  /**
   * Set the message being replied to
   */
  setReplyingTo: (message: ChatMessage | null) => void;
  
  /**
   * The message being edited
   */
  editingMessage: ChatMessage | null;
  
  /**
   * Set the message being edited
   */
  setEditingMessage: (message: ChatMessage | null) => void;
  
  /**
   * Grouped messages for rendering
   */
  groupedMessages: {
    user: ChatUser;
    messages: ChatMessage[];
    timestamp: Date | string;
  }[];
  
  /**
   * Users who are currently typing
   */
  typingUsers: ChatUser[];
}

/**
 * Hook for managing chat messages with grouping, reactions, and read receipts
 */
export function useChatMessages(options: UseChatMessagesOptions = {}): UseChatMessagesReturn {
  const {
    initialMessages = [],
    currentUser,
    groupByUser = true,
    groupTimeThreshold = 2,
    showTimestamps = false,
    showReadReceipts = true,
    showTypingIndicators = true,
    onSendMessage,
    onEditMessage,
    onDeleteMessage,
    onAddReaction,
    onRemoveReaction,
    onReadMessage,
    onLoadMoreMessages,
  } = options;
  
  // State
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [typingUsers, setTypingUsers] = useState<ChatUser[]>([]);
  
  // Group messages by user and time
  const groupedMessages = useMemo(() => {
    if (!groupByUser) {
      return messages.map(message => ({
        user: message.user,
        messages: [message],
        timestamp: message.timestamp,
      }));
    }
    
    const groups: {
      user: ChatUser;
      messages: ChatMessage[];
      timestamp: Date | string;
    }[] = [];
    
    let currentGroup: {
      user: ChatUser;
      messages: ChatMessage[];
      timestamp: Date | string;
    } | null = null;
    
    messages.forEach(message => {
      const messageTime = new Date(message.timestamp).getTime();
      
      if (
        currentGroup &&
        currentGroup.user.id === message.user.id &&
        (
          new Date(currentGroup.timestamp).getTime() + groupTimeThreshold * 60 * 1000 >= messageTime
        )
      ) {
        // Add to current group
        currentGroup.messages.push(message);
      } else {
        // Create new group
        if (currentGroup) {
          groups.push(currentGroup);
        }
        
        currentGroup = {
          user: message.user,
          messages: [message],
          timestamp: message.timestamp,
        };
      }
    });
    
    if (currentGroup) {
      groups.push(currentGroup);
    }
    
    return groups;
  }, [messages, groupByUser, groupTimeThreshold]);
  
  // Send a new message
  const sendMessage = useCallback(async (
    content: string,
    attachments?: ChatAttachment[],
    replyTo?: ChatMessage
  ): Promise<ChatMessage> => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      throw new Error('Message content cannot be empty');
    }
    
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Create a temporary message with pending status
    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      id: tempId,
      content,
      user: currentUser,
      timestamp: new Date(),
      isPending: true,
      attachments,
      replyTo,
    };
    
    // Add the temporary message to the list
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      // Send the message to the server
      if (onSendMessage) {
        const sentMessage = await onSendMessage(content, attachments, replyTo);
        
        // Replace the temporary message with the sent message
        setMessages(prev => prev.map(msg => 
          msg.id === tempId ? sentMessage : msg
        ));
        
        // Clear the replying to state
        setReplyingTo(null);
        
        return sentMessage;
      }
      
      // If no onSendMessage callback is provided, simulate a sent message
      const sentMessage: ChatMessage = {
        ...tempMessage,
        id: `msg-${Date.now()}`,
        isPending: false,
        isDelivered: true,
      };
      
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? sentMessage : msg
      ));
      
      setReplyingTo(null);
      
      return sentMessage;
    } catch (error) {
      // Mark the message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, isPending: false, isFailed: true } : msg
      ));
      
      throw error;
    }
  }, [currentUser, onSendMessage]);
  
  // Edit a message
  const editMessage = useCallback(async (
    message: ChatMessage,
    newContent: string
  ): Promise<ChatMessage> => {
    if (!newContent.trim()) {
      throw new Error('Message content cannot be empty');
    }
    
    if (message.user.id !== currentUser?.id) {
      throw new Error('Cannot edit a message from another user');
    }
    
    // Update the message locally
    const originalContent = message.originalContent || message.content;
    const updatedMessage: ChatMessage = {
      ...message,
      content: newContent,
      isEdited: true,
      originalContent,
      editedTimestamp: new Date(),
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? updatedMessage : msg
    ));
    
    try {
      // Send the edit to the server
      if (onEditMessage) {
        const editedMessage = await onEditMessage(message, newContent);
        
        // Update the message with the response from the server
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? editedMessage : msg
        ));
        
        setEditingMessage(null);
        
        return editedMessage;
      }
      
      setEditingMessage(null);
      
      return updatedMessage;
    } catch (error) {
      // Revert the edit on error
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? message : msg
      ));
      
      throw error;
    }
  }, [currentUser, onEditMessage]);
  
  // Delete a message
  const deleteMessage = useCallback(async (message: ChatMessage): Promise<boolean> => {
    if (message.user.id !== currentUser?.id) {
      throw new Error('Cannot delete a message from another user');
    }
    
    // Mark the message as deleted locally
    const deletedMessage: ChatMessage = {
      ...message,
      isDeleted: true,
      content: 'This message has been deleted',
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? deletedMessage : msg
    ));
    
    try {
      // Send the delete to the server
      if (onDeleteMessage) {
        const success = await onDeleteMessage(message);
        
        if (!success) {
          // Revert the delete on error
          setMessages(prev => prev.map(msg => 
            msg.id === message.id ? message : msg
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the delete on error
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? message : msg
      ));
      
      throw error;
    }
  }, [currentUser, onDeleteMessage]);
  
  // Add a reaction to a message
  const addReaction = useCallback(async (
    message: ChatMessage,
    reaction: string
  ): Promise<ChatReaction | undefined> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Check if the user has already added this reaction
    const hasReaction = message.reactions?.some(
      r => r.user.id === currentUser.id && r.type === reaction
    );
    
    if (hasReaction) {
      return;
    }
    
    // Create a temporary reaction
    const tempReaction: ChatReaction = {
      type: reaction,
      user: currentUser,
      timestamp: new Date(),
    };
    
    // Add the reaction locally
    const updatedMessage: ChatMessage = {
      ...message,
      reactions: [...(message.reactions || []), tempReaction],
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? updatedMessage : msg
    ));
    
    try {
      // Send the reaction to the server
      if (onAddReaction) {
        const serverReaction = await onAddReaction(message, reaction);
        
        // Update the message with the response from the server
        setMessages(prev => prev.map(msg => {
          if (msg.id !== message.id) return msg;
          
          const reactions = [...(msg.reactions || [])];
          const tempIndex = reactions.findIndex(
            r => r.user.id === currentUser.id && r.type === reaction && !r.timestamp
          );
          
          if (tempIndex !== -1) {
            reactions[tempIndex] = serverReaction;
          }
          
          return {
            ...msg,
            reactions,
          };
        }));
        
        return serverReaction;
      }
      
      return tempReaction;
    } catch (error) {
      // Remove the reaction on error
      setMessages(prev => prev.map(msg => {
        if (msg.id !== message.id) return msg;
        
        return {
          ...msg,
          reactions: (msg.reactions || []).filter(
            r => !(r.user.id === currentUser.id && r.type === reaction)
          ),
        };
      }));
      
      throw error;
    }
  }, [currentUser, onAddReaction]);
  
  // Remove a reaction from a message
  const removeReaction = useCallback(async (
    message: ChatMessage,
    reaction: string
  ): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('Current user is not defined');
    }
    
    // Check if the user has added this reaction
    const hasReaction = message.reactions?.some(
      r => r.user.id === currentUser.id && r.type === reaction
    );
    
    if (!hasReaction) {
      return false;
    }
    
    // Remove the reaction locally
    const updatedMessage: ChatMessage = {
      ...message,
      reactions: (message.reactions || []).filter(
        r => !(r.user.id === currentUser.id && r.type === reaction)
      ),
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? updatedMessage : msg
    ));
    
    try {
      // Send the removal to the server
      if (onRemoveReaction) {
        const success = await onRemoveReaction(message, reaction);
        
        if (!success) {
          // Revert the removal on error
          setMessages(prev => prev.map(msg => 
            msg.id === message.id ? message : msg
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the removal on error
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? message : msg
      ));
      
      throw error;
    }
  }, [currentUser, onRemoveReaction]);
  
  // Mark a message as read
  const markAsRead = useCallback(async (message: ChatMessage): Promise<boolean> => {
    if (message.isRead) {
      return true;
    }
    
    // Mark the message as read locally
    const updatedMessage: ChatMessage = {
      ...message,
      isRead: true,
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? updatedMessage : msg
    ));
    
    try {
      // Send the read status to the server
      if (onReadMessage) {
        const success = await onReadMessage(message);
        
        if (!success) {
          // Revert the read status on error
          setMessages(prev => prev.map(msg => 
            msg.id === message.id ? message : msg
          ));
          
          return false;
        }
      }
      
      return true;
    } catch (error) {
      // Revert the read status on error
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? message : msg
      ));
      
      throw error;
    }
  }, [onReadMessage]);
  
  // Load more messages
  const loadMoreMessages = useCallback(async (): Promise<ChatMessage[]> => {
    if (isLoadingMore || !hasMoreMessages || !onLoadMoreMessages) {
      return [];
    }
    
    setIsLoadingMore(true);
    
    try {
      const oldestMessage = messages[0];
      const oldestTimestamp = oldestMessage ? oldestMessage.timestamp : undefined;
      
      const olderMessages = await onLoadMoreMessages(oldestTimestamp);
      
      if (olderMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages(prev => [...olderMessages, ...prev]);
      }
      
      return olderMessages;
    } catch (error) {
      console.error('Error loading more messages:', error);
      return [];
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreMessages, messages, onLoadMoreMessages]);
  
  return {
    messages,
    currentUser,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    markAsRead,
    loadMoreMessages,
    isLoadingMore,
    hasMoreMessages,
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
    groupedMessages,
    typingUsers,
  };
}

export default useChatMessages;
