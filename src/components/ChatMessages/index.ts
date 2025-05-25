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
  Action,
  TypingIndicator,
  Input,
  AttachButton,
  SendButton,
  LoadMore,
  Empty,
  Loading,
  Consumer
} from './ChatMessagesComponents';

import { Root, List, Group, Item } from './ChatMessages';
import useChatMessages from './useChatMessages';

// Assemble the compound component
export const ChatMessages = {
  Root,
  List,
  Group,
  Item,
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
  Consumer,
  useChatMessages,
};

export * from './useChatMessages';
export * from './ChatMessages';
export * from './ChatMessagesComponents';
export default ChatMessages;
