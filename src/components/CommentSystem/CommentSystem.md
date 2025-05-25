# CommentSystem

A headless UI component for building flexible and accessible comment systems with threading, reactions, and moderation capabilities.

## Features

- **Headless Architecture**: Fully customizable styling and rendering
- **Threaded Comments**: Support for nested replies with configurable depth
- **Reactions**: Add and remove emoji reactions to comments
- **Moderation Tools**: Flag, pin, and delete comments
- **Pagination**: Load more comments with optional infinite scrolling
- **Sorting Options**: Sort by newest, oldest, popularity, or threaded view
- **Accessibility**: ARIA attributes and keyboard navigation
- **Compound Component Pattern**: Intuitive API for building complex UIs

## Installation

```bash
npm install @strive-ui/comment-system
# or
yarn add @strive-ui/comment-system
```

## Basic Usage

```jsx
import React from 'react';
import CommentSystem from '@strive-ui/comment-system';

const initialComments = [
  {
    id: '1',
    content: 'This is a great article!',
    user: {
      id: 'user1',
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar1.jpg'
    },
    timestamp: new Date('2023-05-15T10:30:00')
  },
  {
    id: '2',
    content: 'I agree with John, very insightful.',
    user: {
      id: 'user2',
      name: 'Jane Smith',
      avatarUrl: 'https://example.com/avatar2.jpg'
    },
    timestamp: new Date('2023-05-15T11:45:00')
  }
];

const currentUser = {
  id: 'user3',
  name: 'Current User',
  avatarUrl: 'https://example.com/avatar3.jpg',
  isCurrentUser: true
};

const CommentsSection = () => {
  return (
    <CommentSystem.Root 
      initialComments={initialComments}
      currentUser={currentUser}
    >
      <h2>Comments (2)</h2>
      
      <CommentSystem.Sort />
      
      <CommentSystem.List />
      
      <CommentSystem.Form placeholder="Join the discussion..." />
      
      <CommentSystem.Empty />
      <CommentSystem.Loading />
      <CommentSystem.LoadMore />
    </CommentSystem.Root>
  );
};

export default CommentsSection;
```

## Advanced Usage

### Custom Styling and Rendering

```jsx
import React from 'react';
import CommentSystem from '@strive-ui/comment-system';
import { formatDistanceToNow } from 'date-fns';

const CustomCommentsSection = () => {
  return (
    <CommentSystem.Root 
      initialComments={initialComments}
      currentUser={currentUser}
      threading={true}
      maxThreadDepth={3}
      onAddComment={async (content, parentId) => {
        // Custom implementation to add a comment to your backend
        const response = await api.addComment(content, parentId);
        return response.data;
      }}
    >
      <div className="comments-header">
        <h2>Discussion</h2>
        <div className="comments-sort">
          <label htmlFor="sort-comments">Sort by: </label>
          <CommentSystem.Sort id="sort-comments" className="custom-select" />
        </div>
      </div>
      
      <CommentSystem.Form 
        className="custom-form"
        placeholder="What are your thoughts?"
        submitText="Comment"
      />
      
      <CommentSystem.Consumer>
        {({ comments, threadedComments }) => (
          <div className="comments-stats">
            {comments.length} comments in this discussion
          </div>
        )}
      </CommentSystem.Consumer>
      
      <CommentSystem.List className="custom-comment-list">
        {threadedComments => (
          threadedComments.map(thread => (
            <CommentSystem.Thread 
              key={thread.comment.id}
              thread={thread}
              className="custom-thread"
            >
              <CommentSystem.Item 
                comment={thread.comment}
                depth={thread.depth}
                className="custom-comment"
              >
                <div className="comment-header">
                  <CommentSystem.Avatar 
                    user={thread.comment.user}
                    className="custom-avatar"
                  />
                  <CommentSystem.Author 
                    user={thread.comment.user}
                    className="custom-author"
                  />
                  <CommentSystem.Timestamp className="custom-timestamp">
                    {formatDistanceToNow(new Date(thread.comment.timestamp), { addSuffix: true })}
                  </CommentSystem.Timestamp>
                </div>
                
                <CommentSystem.Content className="custom-content">
                  {thread.comment.content}
                </CommentSystem.Content>
                
                <CommentSystem.Reactions className="custom-reactions" />
                
                <CommentSystem.Actions 
                  comment={thread.comment}
                  className="custom-actions"
                />
              </CommentSystem.Item>
              
              {thread.replies.length > 0 && (
                <div className="custom-replies">
                  {thread.replies.map(reply => (
                    <CommentSystem.Item 
                      key={reply.id}
                      comment={reply}
                      depth={thread.depth + 1}
                      className="custom-reply"
                    />
                  ))}
                </div>
              )}
            </CommentSystem.Thread>
          ))
        )}
      </CommentSystem.List>
      
      <CommentSystem.LoadMore className="custom-load-more">
        Show more comments
      </CommentSystem.LoadMore>
    </CommentSystem.Root>
  );
};
```

### Server Integration

```jsx
import React from 'react';
import CommentSystem from '@strive-ui/comment-system';
import { commentService } from './services';

const ServerIntegratedComments = () => {
  return (
    <CommentSystem.Root 
      initialComments={[]}
      currentUser={currentUser}
      onAddComment={commentService.addComment}
      onEditComment={commentService.editComment}
      onDeleteComment={commentService.deleteComment}
      onAddReaction={commentService.addReaction}
      onRemoveReaction={commentService.removeReaction}
      onFlagComment={commentService.flagComment}
      onPinComment={commentService.pinComment}
      onLoadMoreComments={commentService.loadMoreComments}
    >
      {/* Components */}
    </CommentSystem.Root>
  );
};
```

## API Reference

### CommentSystem.Root

The root component that provides context to all other components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialComments` | `Comment[]` | `[]` | Initial list of comments |
| `currentUser` | `CommentUser` | `undefined` | The current user |
| `initialSortOrder` | `'newest' \| 'oldest' \| 'popular' \| 'threaded'` | `'newest'` | Initial sort order |
| `initialPageSize` | `number` | `10` | Initial page size |
| `infiniteScroll` | `boolean` | `false` | Whether to enable infinite scrolling |
| `threading` | `boolean` | `true` | Whether to enable threading (replies) |
| `maxThreadDepth` | `number` | `3` | Maximum nesting level for threaded comments |
| `onAddComment` | `(content: string, parentId?: string \| number \| null) => Promise<Comment>` | `undefined` | Callback when a comment is added |
| `onEditComment` | `(comment: Comment, newContent: string) => Promise<Comment>` | `undefined` | Callback when a comment is edited |
| `onDeleteComment` | `(comment: Comment) => Promise<boolean>` | `undefined` | Callback when a comment is deleted |
| `onAddReaction` | `(comment: Comment, reaction: string) => Promise<CommentReaction>` | `undefined` | Callback when a reaction is added to a comment |
| `onRemoveReaction` | `(comment: Comment, reaction: string) => Promise<boolean>` | `undefined` | Callback when a reaction is removed from a comment |
| `onFlagComment` | `(comment: Comment, reason?: string) => Promise<boolean>` | `undefined` | Callback when a comment is flagged |
| `onPinComment` | `(comment: Comment, isPinned: boolean) => Promise<boolean>` | `undefined` | Callback when a comment is pinned or unpinned |
| `onLoadMoreComments` | `(page: number, sortOrder: string) => Promise<Comment[]>` | `undefined` | Callback when more comments are loaded |

### CommentSystem.List

Renders the list of comments.

### CommentSystem.Thread

Renders a comment thread with its replies.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `thread` | `{ comment: Comment; replies: Comment[]; depth: number; }` | The thread data |

### CommentSystem.Item

Renders a single comment.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `comment` | `Comment` | Required | The comment data |
| `depth` | `number` | `0` | The depth level of the comment |

### CommentSystem.Content

Renders the content of a comment.

### CommentSystem.Author

Renders the author information.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `user` | `CommentUser` | The user data |

### CommentSystem.Avatar

Renders the user avatar.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | `CommentUser` | Required | The user data |
| `showFallback` | `boolean` | `true` | Fallback for when avatar URL is not available |

### CommentSystem.Metadata

Container for comment metadata like timestamp and edit status.

### CommentSystem.Timestamp

Renders a formatted timestamp.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | `'relative' \| 'full' \| 'short' \| 'time'` | `'relative'` | Date format |

### CommentSystem.Reactions

Container for comment reactions.

### CommentSystem.Reaction

Renders a single reaction button.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `reaction` | `string` | The reaction type |
| `comment` | `Comment` | The comment to react to |
| `count` | `number` | The count of this reaction |
| `hasReacted` | `boolean` | Whether the current user has reacted with this reaction |

### CommentSystem.Actions

Container for comment actions.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `comment` | `Comment` | The comment to show actions for |

### CommentSystem.Action

Renders a single action button.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `action` | `'reply' \| 'edit' \| 'delete' \| 'flag' \| 'pin' \| 'react'` | The action type |
| `comment` | `Comment` | The comment to perform the action on |

### CommentSystem.Form

Renders a comment form for adding, replying to, or editing comments.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `parentId` | `string \| number \| null` | `null` | The parent comment ID for replies |
| `placeholder` | `string` | `'Write a comment...'` | Placeholder text for the input |
| `submitText` | `string` | `'Post'` | Submit button text |
| `cancelText` | `string` | `'Cancel'` | Cancel button text (for editing/replying) |
| `autoFocus` | `boolean` | `false` | Whether to auto focus the input |

### CommentSystem.Sort

Renders a dropdown to sort comments.

### CommentSystem.LoadMore

Renders a button to load more comments.

### CommentSystem.Empty

Renders content when there are no comments.

### CommentSystem.Loading

Renders content when comments are loading.

### CommentSystem.Consumer

Provides access to the comment system context using render props pattern.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `(context: UseCommentSystemReturn) => React.ReactNode` | Render prop function |

## Types

### Comment

```typescript
interface Comment {
  id: string | number;
  content: string;
  user: CommentUser;
  timestamp: Date | string;
  parentId?: string | number | null;
  reactions?: CommentReaction[];
  isEdited?: boolean;
  editedTimestamp?: Date | string;
  isDeleted?: boolean;
  isPinned?: boolean;
  isFeatured?: boolean;
  isFlagged?: boolean;
  metadata?: Record<string, any>;
}
```

### CommentUser

```typescript
interface CommentUser {
  id: string | number;
  name: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
  role?: string;
  metadata?: Record<string, any>;
}
```

### CommentReaction

```typescript
interface CommentReaction {
  type: string;
  user: CommentUser;
  timestamp: Date | string;
}
```

## Accessibility

The CommentSystem component follows accessibility best practices:

- Proper ARIA roles and attributes
- Keyboard navigation support
- Semantic HTML structure
- Screen reader friendly content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (with polyfills)

## License

MIT
