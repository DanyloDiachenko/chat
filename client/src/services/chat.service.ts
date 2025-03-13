import { io, Socket } from "socket.io-client";
import { User } from "../interfaces/user.interface";
import { Message } from "../interfaces/message.interface";
import { Dispatch, SetStateAction } from "react";

export class ChatService {
    private readonly IMAGES_URL = "https://i.pravatar.cc/150?img=";
    private socket: Socket | null = null;
    private user: User | null = null;

    constructor(
        private setUsers: (users: User[]) => void,
        private setMessages: Dispatch<SetStateAction<Message[]>>,
        private setIsTyping: Dispatch<
            SetStateAction<{ [key: string]: boolean }>
        >,
        private setUser: (user: User) => void,
    ) {
        this.initializeUser();
    }

    private generateRandomString = (length: number) => {
        return Math.random()
            .toString(36)
            .substring(2, 2 + length);
    };

    private generateRandomUser(): User {
        return {
            id: Date.now().toString(),
            name: this.generateRandomString(10),
            description: Array(10)
                .fill(null)
                .map(() => this.generateRandomString(4))
                .join(" "),
            avatar: `${this.IMAGES_URL}${Math.floor(Math.random() * 70)}`,
            online: true,
            isBot: false,
        };
    }

    private initializeUser() {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            const newUser = this.generateRandomUser();
            localStorage.setItem("user", JSON.stringify(newUser));
            this.user = newUser;
            this.setUser(newUser);
        } else {
            this.user = JSON.parse(storedUser);
            this.setUser(this.user as User);
        }
    }

    connectSocket() {
        if (!this.user) return;

        this.socket = io("http://localhost:3005", {
            query: {
                id: this.user.id,
                name: this.user.name,
                avatar: this.user.avatar,
                description: this.user.description,
            },
        });

        this.setupSocketListeners();
    }

    private setupSocketListeners() {
        if (!this.socket) return;

        this.socket.on("updateUsers", (users: User[]) => {
            this.setUsers(users);
        });

        this.socket.on("receiveMessage", (message: Message) => {
            this.setMessages((prev: Message[]) => [...prev, message]);
        });

        this.socket.on(
            "typing",
            ({ userId, typing }: { userId: string; typing: boolean }) => {
                this.setIsTyping((prev: { [key: string]: boolean }) => ({
                    ...prev,
                    [userId]: typing,
                }));
            },
        );

        this.socket.on("messageHistory", (history: Message[]) => {
            this.setMessages(history);
        });
    }

    sendMessage(text: string, activeContactItem: User | null) {
        if (!this.socket || !activeContactItem || !this.user) return;

        const newMessage = {
            sender: this.user.id,
            recipient: activeContactItem.id,
            text,
        };
        this.socket.emit("sendMessage", newMessage);
    }

    requestMessageHistory(contactId: string) {
        this.socket?.emit("requestMessageHistory", contactId);
    }

    setActiveChat(contactId: string) {
        this.socket?.emit("setActiveChat", contactId);
    }

    notifyTyping(isTyping: boolean) {
        this.socket?.emit("userTyping", isTyping);
    }

    searchUsers(search: string) {
        this.socket?.emit("searchUsers", search, (users: User[]) => {
            this.setUsers(users);
        });
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    get currentUser() {
        return this.user;
    }
}
