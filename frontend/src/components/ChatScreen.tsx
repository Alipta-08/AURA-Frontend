import { useEffect, useRef } from "react";
import { Message } from "../types/types";
import Chat from "./Chat";
import Thinking from "./Thinking";

interface ChatScreenProps {
  chats: Message[];
  thinking: boolean;
}

const ChatScreen = ({ chats, thinking }: ChatScreenProps) => {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div
      ref={chatRef}
      className="px-28 flex-grow h-[350px] overflow-y-auto scroll-smooth"
    >
      {chats.map((chat, index) => (
        <Chat
          key={index}
          message={chat}
          lastChat={index === chats.length - 1}
        />
      ))}
      {thinking && <Thinking />}
    </div>
  );
};

export default ChatScreen;
