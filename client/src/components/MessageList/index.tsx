import { Message } from "../../interfaces/message.interface";
import { User } from "../../interfaces/user.interface";
import { ChatMessage } from "./ChatMessage";

interface MessageListProps {
    messages: Message[];
    me: User;
}

export const MessageList = ({ messages, me }: MessageListProps) => (
    <div className="flex-1 overflow-y-auto pl-4 pr-6 min-h-[55vh]">
        {messages.map((msg, index) => (
            <ChatMessage key={index} me={me} {...msg} />
        ))}
    </div>
);
