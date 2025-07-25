import { Message } from "../types/types";

interface ChatProps {
  message: Message;
  lastChat?: boolean;
}

const Chat = ({ message, lastChat }: ChatProps) => {
  return (
    <div
      className={`chat ${
        message.sender === "User" ? "chat-end" : "chat-start"
      }`}
    >
      <div
        className={`mx-2 my-1 chat-header font-bold ${
          message.sender === "Bot" && "text-primary"
        }`}
      >
        {message.sender === "User" ? "You" : "AURA"}
      </div>
      <div
        className={`chat-bubble flex flex-col rounded-box md:text-lg ${
          message.sender === "User" && "chat-bubble-primary"
        }`}
      >
        <div className="m-2 whitespace-pre-line">{message.message}</div>
        {message.sources && message.sources.length > 0 && (
          <div
            className={`dropdown dropdown-hover ${
              lastChat ? "dropdown-top" : ""
            }`}
          >
            <button
              tabIndex={0}
              className="btn btn-ghost rounded-box text-sm opacity-50 hover:text-primary hover:opacity-100"
            >
              Sources
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 bg-opacity-90 rounded-box z-[1] px-1 py-2"
            >
              {message.sources.map((source, index) => (
                <li key={index}>
                  <a href={source} target="_blank" rel="noreferrer">
                    {index + 1}
                    {"."}&nbsp;
                    <span className="text-xs w-60 rounded-box md:w-full md:text-sm text-primary opacity-80 hover:opacity-100 hover:underline">
                      {source}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
