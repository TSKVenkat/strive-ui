# Chat Messages

A flexible and customizable headless component for building chat interfaces with support for message grouping, reactions, attachments, and read receipts.

## Features

- **Headless Architecture**: Separation of logic from presentation for maximum styling flexibility
- **Compound Component Pattern**: Intuitive API with nested components for complex UIs
- **Message Grouping**: Group messages by user and time for a cleaner UI
- **Attachments**: Support for various attachment types (images, videos, audio, files)
- **Reactions**: Add and remove emoji reactions to messages
- **Read Receipts**: Show message delivery and read status
- **Typing Indicators**: Display when users are typing
- **Reply Threading**: Support for message replies and threading
- **Message Editing**: Edit and delete messages
- **Pagination**: Load more messages as needed
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation

## Installation

```bash
npm install @pulseui/chat-messages
```

## Usage

### Basic Usage

```jsx
import { ChatMessages } from '@pulseui/chat-messages';

const currentUser = {
  id: '1',
  name: 'You',
  isCurrentUser: true
};

const messages = [
  {
    id: '1',
    content: 'Hello there!',
    user: {
      id: '2',
      name: 'John',
      avatarUrl: 'https://example.com/avatar1.jpg'
    },
    timestamp: '2025-05-24T10:30:00Z',
    isRead: true
  },
  {
    id: '2',
    content: 'Hi! How are you doing?',
    user: currentUser,
    timestamp: '2025-05-24T10:31:00Z',
    isDelivered: true
  },
  // More messages...
];

function App() {
  const handleSendMessage = async (content) => {
    // In a real app, you would send the message to your backend
    console.log('Sending message:', content);
    
    // Return a new message object
    return {
      id: Date.now().toString(),
      content,
      user: currentUser,
      timestamp: new Date(),
      isPending: false,
      isDelivered: true
    };
  };
  
  return (
    <ChatMessages.Root 
      initialMessages={messages}
      currentUser={currentUser}
      onSendMessage={handleSendMessage}
    >
      <div className="chat-container">
        <ChatMessages.List autoScroll={true}>
          <ChatMessages.Empty>No messages yet. Start the conversation!</ChatMessages.Empty>
        </ChatMessages.List>
        
        <div className="chat-input-container">
          <ChatMessages.Input 
            placeholder="Type a message..." 
            submitOnEnter={true}
          />
        </div>
      </div>
    </ChatMessages.Root>
  );
}
```

### Custom Styling with Styled Components

```jsx
import { ChatMessages } from '@pulseui/chat-messages';
import styled from 'styled-components';

// Custom styled components
const StyledChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledMessageList = styled(ChatMessages.List)`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
`;

const StyledMessageGroup = styled(ChatMessages.Group)`
  margin-bottom: 16px;
  
  &.current-user {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`;

const StyledMessage = styled(ChatMessages.Item)`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  margin-bottom: 4px;
  
  &.current-user {
    background-color: #1976d2;
    color: white;
  }
  
  &:not(.current-user) {
    background-color: white;
    color: #333;
  }
  
  &.pending {
    opacity: 0.7;
  }
  
  &.failed {
    border: 1px solid #f44336;
  }
`;

const StyledInputContainer = styled.div`
  padding: 10px;
  border-top: 1px solid #e0e0e0;
  background-color: white;
`;

const StyledInput = styled(ChatMessages.Input)`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  resize: none;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

function App() {
  return (
    <ChatMessages.Root 
      initialMessages={messages}
      currentUser={currentUser}
      onSendMessage={handleSendMessage}
    >
      <StyledChatContainer>
        <StyledMessageList>
          {({ groupedMessages }) => (
            <>
              {groupedMessages.map((group, index) => (
                <StyledMessageGroup key={index} group={group}>
                  {group.messages.map(message => (
                    <StyledMessage key={message.id} message={message}>
                      <ChatMessages.Content>{message.content}</ChatMessages.Content>
                      <ChatMessages.Timestamp>{message.timestamp}</ChatMessages.Timestamp>
                    </StyledMessage>
                  ))}
                </StyledMessageGroup>
              ))}
            </>
          )}
        </StyledMessageList>
        
        <StyledInputContainer>
          <StyledInput 
            placeholder="Type a message..." 
            submitOnEnter={true}
            autoResize={true}
          />
        </StyledInputContainer>
      </StyledChatContainer>
    </ChatMessages.Root>
  );
}
```

### Advanced Features: Reactions, Attachments, and Replies

```jsx
import { ChatMessages } from '@pulseui/chat-messages';

function App() {
  const handleAddReaction = async (message, reaction) => {
    // In a real app, you would send the reaction to your backend
    console.log('Adding reaction:', reaction, 'to message:', message.id);
    
    // Return a new reaction object
    return {
      type: reaction,
      user: currentUser,
      timestamp: new Date()
    };
  };
  
  const handleAttach = (files) => {
    // In a real app, you would upload the files to your backend
    console.log('Attaching files:', files);
    
    // Process files and create attachment objects
    const attachments = files.map(file => ({
      id: Date.now().toString(),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 
            file.type.startsWith('audio/') ? 'audio' : 'file',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type
    }));
    
    // You would then send these attachments with a message
  };
  
  return (
    <ChatMessages.Root 
      initialMessages={messages}
      currentUser={currentUser}
      onSendMessage={handleSendMessage}
      onAddReaction={handleAddReaction}
    >
      <div className="chat-container">
        <ChatMessages.List>
          {/* Message rendering */}
        </ChatMessages.List>
        
        <div className="chat-input-container">
          <ChatMessages.AttachButton 
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            maxSize={5 * 1024 * 1024} // 5MB
            onAttach={handleAttach}
          >
            Attach
          </ChatMessages.AttachButton>
          
          <ChatMessages.Input 
            placeholder="Type a message..." 
            submitOnEnter={true}
          />
        </div>
      </div>
    </ChatMessages.Root>
  );
}
```

## API Reference

### ChatMessages.Root

The main container component that provides context to all child components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMessages` | `ChatMessage[]` | `[]` | Initial list of messages |
| `currentUser` | `ChatUser` | - | The current user |
| `groupByUser` | `boolean` | `true` | Whether to group messages by user |
| `groupTimeThreshold` | `number` | `2` | Maximum time difference in minutes between messages to be grouped |
| `showTimestamps` | `boolean` | `false` | Whether to show timestamps for each message |
| `showReadReceipts` | `boolean` | `true` | Whether to show read receipts |
| `showTypingIndicators` | `boolean` | `true` | Whether to show typing indicators |
| `onSendMessage` | `(content: string, attachments?: ChatAttachment[], replyTo?: ChatMessage) => Promise<ChatMessage>` | - | Callback when a message is sent |
| `onEditMessage` | `(message: ChatMessage, newContent: string) => Promise<ChatMessage>` | - | Callback when a message is edited |
| `onDeleteMessage` | `(message: ChatMessage) => Promise<boolean>` | - | Callback when a message is deleted |
| `onAddReaction` | `(message: ChatMessage, reaction: string) => Promise<ChatReaction>` | - | Callback when a reaction is added to a message |
| `onRemoveReaction` | `(message: ChatMessage, reaction: string) => Promise<boolean>` | - | Callback when a reaction is removed from a message |
| `onReadMessage` | `(message: ChatMessage) => Promise<boolean>` | - | Callback when a message is read |
| `onLoadMoreMessages` | `(before?: Date | string) => Promise<ChatMessage[]>` | - | Callback when more messages are loaded |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |

### ChatMessage Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | Yes | Unique identifier for the message |
| `content` | `string` | Yes | The content of the message |
| `user` | `ChatUser` | Yes | The user who sent the message |
| `timestamp` | `Date \| string` | Yes | The timestamp when the message was sent |
| `isRead` | `boolean` | No | Whether the message has been read |
| `isDelivered` | `boolean` | No | Whether the message has been delivered |
| `isPending` | `boolean` | No | Whether the message is being sent (pending) |
| `isFailed` | `boolean` | No | Whether the message failed to send |
| `attachments` | `ChatAttachment[]` | No | Attachments for the message |
| `reactions` | `ChatReaction[]` | No | Reactions to the message |
| `isEdited` | `boolean` | No | Whether the message has been edited |
| `originalContent` | `string` | No | The original content of the message before editing |
| `editedTimestamp` | `Date \| string` | No | The timestamp when the message was edited |
| `isDeleted` | `boolean` | No | Whether the message has been deleted |
| `replyTo` | `ChatMessage` | No | The message that this message is replying to |
| `metadata` | `Record<string, any>` | No | Custom metadata for the message |

### ChatUser Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | Yes | Unique identifier for the user |
| `name` | `string` | Yes | The name of the user |
| `avatarUrl` | `string` | No | The avatar URL of the user |
| `isCurrentUser` | `boolean` | No | Whether the user is the current user |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy' \| 'typing'` | No | The status of the user |
| `lastSeen` | `Date \| string` | No | Last seen timestamp |
| `metadata` | `Record<string, any>` | No | Custom metadata for the user |

### Compound Components

| Component | Description |
|-----------|-------------|
| `ChatMessages.List` | Container for the list of messages |
| `ChatMessages.Group` | Container for a group of messages from the same user |
| `ChatMessages.Item` | Individual message |
| `ChatMessages.Content` | Content of a message |
| `ChatMessages.Attachments` | Container for message attachments |
| `ChatMessages.Attachment` | Individual attachment |
| `ChatMessages.Reactions` | Container for message reactions |
| `ChatMessages.Reaction` | Individual reaction |
| `ChatMessages.Timestamp` | Timestamp for a message |
| `ChatMessages.Status` | Status indicator for a message (sent, delivered, read) |
| `ChatMessages.ReplyTo` | Indicator for a message being replied to |
| `ChatMessages.Actions` | Container for message actions |
| `ChatMessages.Action` | Individual action button |
| `ChatMessages.TypingIndicator` | Indicator for users who are typing |
| `ChatMessages.Input` | Input for typing messages |
| `ChatMessages.AttachButton` | Button for attaching files |
| `ChatMessages.SendButton` | Button for sending messages |
| `ChatMessages.LoadMore` | Button to load more messages |
| `ChatMessages.Empty` | Empty state when no messages are found |
| `ChatMessages.Loading` | Loading state when messages are being loaded |
| `ChatMessages.Consumer` | Access the chat messages context with render props |

## Accessibility

The ChatMessages component is built with accessibility in mind:

- Proper semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly content

## Best Practices

1. **Performance**: For large chat histories, use pagination or infinite scrolling to load messages in batches.
2. **Responsive Design**: Adjust the layout based on screen size for optimal user experience.
3. **Error Handling**: Implement proper error states for message sending failures.
4. **Loading States**: Show loading indicators during data fetching to improve user experience.
5. **Grouping**: Use message grouping to create a cleaner, more readable chat interface.
6. **Read Receipts**: Consider privacy implications when implementing read receipts.
7. **Typing Indicators**: Use typing indicators to provide real-time feedback but be mindful of performance.

## Browser Support

The ChatMessages component works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)

## License

MIT
