import { MessageInput } from "@hilla/react-components/MessageInput";
import { MessageList, MessageListItem } from "@hilla/react-components/MessageList";
import { useState } from "react";
import { ChatService } from "../../generated/endpoints";

export default function ChatView() {
  const [messages, setMessages] = useState<MessageListItem[]>([]);

  async function sendMessage(message: string) {
    setMessages(messages => [...messages, {
      userName: 'You',
      text: message
    }]);

    const response = await ChatService.chat(message);
    setMessages(messages => [...messages, {
      userName: 'Assistant',
      text: response
    }]);
  }

  return (
    <div className="p-m flex flex-col h-full box-border">
      <MessageList items={messages} className="flex-grow"/>
      <MessageInput onSubmit={e => sendMessage(e.detail.value)} />
    </div>
  );
}