import { Message } from "../../interfaces/message.interface";
import { ChatMessage } from "./ChatMessage";

interface MessageListProps {
    messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => (
    <div className="flex-1 overflow-y-auto pl-4 pr-6 min-h-[55vh]">
        {messages.map((msg, index) => (
            <ChatMessage key={index} {...msg} />
        ))}
    </div>
);
