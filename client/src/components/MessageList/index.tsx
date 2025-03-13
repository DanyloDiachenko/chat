import { Message } from "../../interfaces/message.interface";
import { User } from "../../interfaces/user.interface";
import { ChatMessage } from "./ChatMessage";

interface MessageListProps {
    messages: Message[];
    me: User;
}

export const MessageList = ({ messages, me }: MessageListProps) => (
    <>
        {messages.map((msg, index) => (
            <ChatMessage key={index} me={me} {...msg} />
        ))}
    </>
);
