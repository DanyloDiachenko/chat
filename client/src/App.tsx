import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "./interfaces/message.interface";
import { ConversationHeader } from "./components/ConversationHeader";
import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { Sidebar } from "./components/Sidebar";
import { User } from "./interfaces/user.interface";

const ChatApp = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [activeContactItem, setActiveContactItem] = useState<User | null>(
        null,
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            const id = Date.now().toString();
            const randomUsername = Math.random().toString(36).substring(2, 15);
            const randomDescription = Math.random()
                .toString(36)
                .substring(2, 15);

            const newUser = {
                id,
                name: randomUsername,
                description: randomDescription,
                avatar: `https://i.pravatar.cc/150?img=${Math.floor(
                    Math.random() * 70,
                )}`,
                online: true,
                isBot: false,
            };
            localStorage.setItem("user", JSON.stringify(newUser));
            setUser(newUser);
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const newSocket = io("http://localhost:3005", {
            query: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                description: user.description,
            },
        });
        setSocket(newSocket);

        newSocket.on("updateUsers", (users: User[]) => {
            console.log("Updated users list:", users);
            setUsers(users);
        });

        newSocket.on("receiveMessage", (message: Message) => {
            console.log("New message received:", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    const handleSendMessage = (text: string) => {
        if (!socket || !activeContactItem || !user) return;

        const newMessage = {
            sender: user.id,
            recipient: activeContactItem.id,
            text,
        };
        console.log("Sending message:", newMessage);
        socket.emit("sendMessage", newMessage);
    };

    const onContactItemClick = (contactItem: User) => {
        setActiveContactItem(contactItem);
        if (socket) {
            socket.emit("requestMessageHistory", contactItem.id);
            socket.emit("setActiveChat", contactItem.id);
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("messageHistory", (history: Message[]) => {
            console.log("Message history received:", history);
            setMessages(history);
        });

        return () => {
            socket.off("messageHistory");
        };
    }, [socket]);

    return (
        <div className="flex flex-col items-center mt-6">
            <h1 className="text-4xl font-medium container">Chat App</h1>
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
                                    <MessageList
                                        messages={messages}
                                        me={user as User}
                                    />
                                    <ChatInput onSend={handleSendMessage} />
                                </>
                            ) : (
                                <div className="h-full mx-auto text-gray-700 text-sm">
                                    Select contact to start chatting...
                                </div>
                            )}
                        </div>
                    </div>
                    <Sidebar
                        bots={users.filter((user) => user.isBot)}
                        users={users.filter((user) => !user.isBot)}
                        onContactItemClick={onContactItemClick}
                        activeContactItem={activeContactItem}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatApp;
