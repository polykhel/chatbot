import { MessageInput } from "@hilla/react-components/MessageInput";
import { MessageList, MessageListItem } from "@hilla/react-components/MessageList";
import { useState } from "react";
import { ChatService } from "../../generated/endpoints";

export default function StreamingChatView() {
  const [messages, setMessages] = useState<MessageListItem[]>([]);

  async function sendMessage(message: string) {
    setMessages(messages => [...messages, {
      userName: "You",
      text: message
    }]);

    let first = true;
    ChatService.chatStream(message).onNext(chunk => {
      if (first && chunk) {
        setMessages(messages => [...messages, {
          userName: "Assistant",
          text: chunk
        }]);
        first = false;
      } else {
        setMessages(messages => {
          const lastMessage = messages[messages.length - 1];
          lastMessage.text += chunk;
          return [...messages.slice(0, -1), lastMessage];
        });
      }
    });
  }

  return (
    <div className="p-m flex flex-col h-full box-border">
      <MessageList items={messages} className="flex-grow"/>
      <MessageInput onSubmit={e => sendMessage(e.detail.value)}/>
    </div>
  );
}
