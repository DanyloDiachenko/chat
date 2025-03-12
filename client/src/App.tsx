import { useState } from "react";
import { Message } from "./interfaces/message.interface";
import { ConversationHeader } from "./components/ConversationHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { Sidebar } from "./components/Sidebar";
import { ContactItem } from "./interfaces/contact-item.interface";

const ChatApp = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            sender: "Reverse bot",
            text: "Hello world!",
            time: "4:20 PM",
            isUser: false,
        },
        {
            sender: "Username",
            text: "Hello robot!",
            time: "4:22 PM",
            isUser: true,
        },
    ]);
    const [activeTab, setActiveTab] = useState("bots");

    const bots: ContactItem[] = [
        {
            name: "Echo bot",
            avatar: "/echo-bot.png",
            description: "Echoing...",
        },
        {
            name: "Reverse bot",
            avatar: "/reverse-bot.png",
            description: "Reversing text...",
        },
        {
            name: "Spam bot",
            avatar: "/spam-bot.png",
            description: "Sending spam...",
        },
        {
            name: "Ignore bot",
            avatar: "/ignore-bot.png",
            description: "Ignoring you...",
        },
    ];

    const users: ContactItem[] = [
        {
            name: "Alice",
            avatar: "/echo-bot.png",
            description: "Hey, how are you?",
        },
        {
            name: "Bob",
            avatar: "/echo-bot.png",
            description: "Did you see that?",
        },
        {
            name: "Charlie",
            avatar: "/echo-bot.png",
            description: "Let's meet up!",
        },
    ];

    const handleSendMessage = (text: string) => {
        setMessages([
            ...messages,
            { sender: "Username", text, time: "Now", isUser: true },
        ]);
    };

    return (
        <div className="flex flex-col items-center mt-6">
            <h1 className="text-4xl font-medium container">Chat bots 2.0</h1>
            <div className="w-full bg-[#586670] min-h-[93vh] mt-3 py-6">
                <div className="flex container">
                    <div className="w-4/5 border-r flex flex-col">
                        <ConversationHeader
                            name="Reverse bot"
                            avatar="/reverse-bot.png"
                            description="Reverses your messages!"
                        />
                        <div className="bg-[#d6dfe7] px-2 p-6">
                            <MessageList messages={messages} />
                            <div className="text-center text-[#84aec6] mt-6">
                                Reverse bot is typing...
                            </div>
                            <ChatInput onSend={handleSendMessage} />
                        </div>
                    </div>
                    <Sidebar
                        bots={bots}
                        users={users}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
