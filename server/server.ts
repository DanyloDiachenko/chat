import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

enum Bots {
    ECHO = "bot-echo",
    REVERSE = "bot-reverse",
    SPAM = "bot-spam",
    IGNORE = "bot-ignore",
}

const IMAGES_URL = "https://i.pravatar.cc/150?img=";

interface User {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    isBot: boolean;
    description: string;
}

interface Message {
    sender: string;
    recipient: string;
    text: string;
    time: string;
}

interface Bot extends User {}

class ChatServer {
    private app = express();
    private server = http.createServer(this.app);
    private io = new Server(this.server, {
        cors: { origin: "*" },
    });

    private users: User[] = [];
    private messages: Message[] = [];
    private bots: Bot[] = [
        {
            id: Bots.ECHO,
            name: "Echo Bot",
            avatar: `${IMAGES_URL}1`,
            online: true,
            isBot: true,
            description: "I'm Echo Bot. I repeat everything you say!",
        },
        {
            id: Bots.REVERSE,
            name: "Reverse Bot",
            avatar: `${IMAGES_URL}2`,
            online: true,
            isBot: true,
            description: "I reverse your messages. Try me!",
        },
        {
            id: Bots.SPAM,
            name: "Spam Bot",
            avatar: `${IMAGES_URL}3`,
            online: true,
            isBot: true,
            description: "I send spam messages to users randomly.",
        },
        {
            id: Bots.IGNORE,
            name: "Ignore Bot",
            avatar: `${IMAGES_URL}4`,
            online: true,
            isBot: true,
            description: "I don't respond to messages.",
        },
    ];

    private activeChats: Record<string, string> = {};
    private spamTimers: Record<string, NodeJS.Timeout> = {};

    private static readonly SPAM_MIN_DELAY = 10000;
    private static readonly SPAM_MAX_DELAY = 120000;
    private static readonly ECHO_DELAY = 1000;
    private static readonly REVERSE_DELAY = 3000;

    private static readonly SPAM_MESSAGES = [
        "Hello!",
        "How are you?",
        "I'm a bot!",
        "Just checking in.",
        "Stay safe!",
    ];

    constructor(private port: number) {
        this.app.use(cors());
        this.initiSocketEvents();
        this.server.listen(this.port, () =>
            console.log(`Server running on port ${this.port}`),
        );
    }

    private initiSocketEvents() {
        this.io.on("connection", (socket: Socket) => {
            const userData = socket.handshake.query as unknown as User;
            const userId = userData.id;
            let user: User;

            const existingUser = this.users.find((u) => u.id === userId);
            if (existingUser) {
                user = existingUser;
                user.online = true;
            } else {
                user = {
                    id: userData.id,
                    name: userData.name,
                    avatar: userData.avatar,
                    online: true,
                    isBot: false,
                    description: userData.description,
                };
                this.users.push(user);
            }

            socket.join(user.id);
            this.io.emit("updateUsers", [...this.users, ...this.bots]);

            socket.on("requestMessageHistory", (recipientId: string) => {
                const messageHistory = this.messages.filter(
                    (msg) =>
                        (msg.sender === user.id &&
                            msg.recipient === recipientId) ||
                        (msg.sender === recipientId &&
                            msg.recipient === user.id),
                );
                socket.emit("messageHistory", messageHistory);
            });

            socket.on(
                "searchUsers",
                (search: string, callback: (results: User[]) => void) => {
                    const searchLower = search.toLowerCase();
                    const filteredUsers = this.users.filter((u) =>
                        u.name.toLowerCase().includes(searchLower),
                    );
                    const filteredBots = this.bots.filter((b) =>
                        b.name.toLowerCase().includes(searchLower),
                    );
                    callback([...filteredUsers, ...filteredBots]);
                },
            );

            socket.on(
                "sendMessage",
                ({ recipient, text }: { recipient: string; text: string }) => {
                    if (!text.trim()) return;

                    const newMessage: Message = {
                        sender: user.id,
                        recipient,
                        text,
                        time: new Date().toLocaleTimeString(),
                    };

                    this.messages.push(newMessage);
                    this.emitReceiveMessage(recipient, newMessage);
                    this.emitReceiveMessage(user.id, newMessage);

                    this.handleBotResponse(recipient, newMessage);
                },
            );

            socket.on("setActiveChat", (chatId: string) => {
                this.activeChats[user.id] = chatId;

                if (chatId === Bots.SPAM && !this.spamTimers[user.id]) {
                    this.io
                        .to(user.id)
                        .emit("typing", { userId: Bots.SPAM, typing: true });
                    this.scheduleSpamMessage(user.id);
                }
            });

            socket.on("userTyping", (isTyping: boolean) => {
                this.io.emit("typing", { userId: user.id, typing: isTyping });
            });

            socket.on("disconnect", () => {
                const index = this.users.findIndex((u) => u.id === user.id);
                if (index !== -1) {
                    this.users[index].online = false;
                }
                this.io.emit("updateUsers", [...this.users, ...this.bots]);
            });
        });
    }

    private transformMessage(message: Message): Message {
        return {
            ...message,
            sender: this.getUserName(message.sender),
            recipient: this.getUserName(message.recipient),
        };
    }

    private getUserName(userId: string): string {
        const user =
            this.users.find((u) => u.id === userId) ||
            this.bots.find((b) => b.id === userId);

        return user ? user.name : userId;
    }

    private emitReceiveMessage(target: string, message: Message) {
        const transformedMessage = this.transformMessage(message);

        this.io.to(target).emit("receiveMessage", transformedMessage);
    }

    private scheduleSpamMessage(userId: string) {
        const randomDelay =
            Math.floor(
                Math.random() *
                    (ChatServer.SPAM_MAX_DELAY - ChatServer.SPAM_MIN_DELAY + 1),
            ) + ChatServer.SPAM_MIN_DELAY;

        if (this.spamTimers[userId]) {
            clearTimeout(this.spamTimers[userId]);
        }

        this.spamTimers[userId] = setTimeout(() => {
            if (this.activeChats[userId] === Bots.SPAM) {
                const randomMessage =
                    ChatServer.SPAM_MESSAGES[
                        Math.floor(
                            Math.random() * ChatServer.SPAM_MESSAGES.length,
                        )
                    ];

                this.sendBotMessage(Bots.SPAM, userId, randomMessage);
                this.scheduleSpamMessage(userId);
            }
        }, randomDelay);
    }

    private handleBotResponse(botId: string, message: Message) {
        const recipient = message.sender;

        switch (botId) {
            case Bots.ECHO:
                this.io
                    .to(recipient)
                    .emit("typing", { userId: botId, typing: true });
                setTimeout(() => {
                    this.sendBotMessage(botId, recipient, message.text);
                    this.io
                        .to(recipient)
                        .emit("typing", { userId: botId, typing: false });
                }, ChatServer.ECHO_DELAY);
                break;

            case Bots.REVERSE:
                this.io
                    .to(recipient)
                    .emit("typing", { userId: botId, typing: true });
                setTimeout(() => {
                    const reversedText = message.text
                        .split("")
                        .reverse()
                        .join("");
                    this.sendBotMessage(botId, recipient, reversedText);
                    this.io
                        .to(recipient)
                        .emit("typing", { userId: botId, typing: false });
                }, ChatServer.REVERSE_DELAY);
                break;

            case Bots.IGNORE:
                this.io
                    .to(recipient)
                    .emit("typing", { userId: botId, typing: false });
                break;

            case Bots.SPAM:
                this.io
                    .to(recipient)
                    .emit("typing", { userId: botId, typing: false });
                this.scheduleSpamMessage(recipient);
                break;
            default:
                break;
        }
    }

    private sendBotMessage(botId: string, recipient: string, text: string) {
        const botMessage: Message = {
            sender: botId,
            recipient,
            text,
            time: new Date().toLocaleTimeString(),
        };

        this.messages.push(botMessage);
        this.emitReceiveMessage(recipient, botMessage);
    }
}

const PORT = 3005;
new ChatServer(PORT);
