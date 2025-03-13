import { useState, useEffect, useRef } from "react";
import { ConversationHeader } from "./components/ConversationHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { Sidebar } from "./components/Sidebar";
import { User } from "./interfaces/user.interface";
import { Message } from "./interfaces/message.interface";
import { ChatService } from "./services/chat.service";

const ChatApp = () => {
    const [activeContactItem, setActiveContactItem] = useState<User | null>(
        null,
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});
    const [message, setMessage] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const chatService = useRef<ChatService | null>(null);

    useEffect(() => {
        chatService.current = new ChatService(
            setUsers,
            setMessages,
            setIsTyping,
            setUser,
        );
        chatService.current.connectSocket();

        return () => {
            chatService.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const onSendMessage = (text: string) => {
        chatService.current?.sendMessage(text, activeContactItem);
        setMessage("");
    };

    const onContactItemClick = (contactItem: User) => {
        setActiveContactItem(contactItem);
        chatService.current?.requestMessageHistory(contactItem.id);
        chatService.current?.setActiveChat(contactItem.id);
    };

    const onTypingMessage = (isTyping: boolean) => {
        chatService.current?.notifyTyping(isTyping);
    };

    const onUsersSearch = (search: string) => {
        chatService.current?.searchUsers(search);
    };

    useEffect(() => {
        onTypingMessage(message.length > 0);
    }, [message]);

    return (
        <div className="flex flex-col items-center mt-6">
            <h1
                className="text-4xl font-medium container cursor-pointer"
                onClick={() => setActiveContactItem(null)}
            >
                Chat App 2.0
            </h1>
            <div className="w-full bg-[#586670] min-h-[93vh] mt-3 py-6">
                <div className="flex container">
                    <div className="w-4/5 border-r flex flex-col">
                        <ConversationHeader
                            activeContactItem={activeContactItem}
                        />
                        <div
                            className={`bg-[#d6dfe7] px-2 p-6 ${
                                !activeContactItem ? "h-full flex flex-1" : ""
                            }`}
                        >
                            {activeContactItem ? (
                                <>
                                    <div className="flex-1 overflow-y-auto pl-4 pr-6 h-[55vh]">
                                        <MessageList
                                            messages={messages}
                                            me={user as User}
                                        />
                                        <div ref={messagesEndRef} />
                                    </div>
                                    <ChatInput
                                        message={message}
                                        setMessage={setMessage}
                                        onSend={onSendMessage}
                                        isTyping={
                                            isTyping[activeContactItem.id]
                                        }
                                        activeContactItem={activeContactItem}
                                    />
                                </>
                            ) : (
                                <div className="h-[63.5vh] mx-auto text-gray-700 text-sm">
                                    Select contact to start chatting...
                                </div>
                            )}
                        </div>
                    </div>
                    <Sidebar
                        onUsersSearch={onUsersSearch}
                        bots={users.filter((u) => u.isBot)}
                        users={users.filter(
                            (u) => !u.isBot && u.id !== user?.id,
                        )}
                        onContactItemClick={onContactItemClick}
                        activeContactItem={activeContactItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
