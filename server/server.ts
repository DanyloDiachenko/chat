import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(cors());

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

const users: User[] = [];
const messages: Message[] = [];
const bots: User[] = [
    {
        id: "bot-echo",
        name: "Echo Bot",
        avatar: "https://i.pravatar.cc/150?img=1",
        online: true,
        isBot: true,
        description: "I'm Echo Bot. I repeat everything you say!",
    },
    {
        id: "bot-reverse",
        name: "Reverse Bot",
        avatar: "https://i.pravatar.cc/150?img=2",
        online: true,
        isBot: true,
        description: "I reverse your messages. Try me!",
    },
    {
        id: "bot-spam",
        name: "Spam Bot",
        avatar: "https://i.pravatar.cc/150?img=3",
        online: true,
        isBot: true,
        description: "I randomly send messages to myself.",
    },
    {
        id: "bot-ignore",
        name: "Ignore Bot",
        avatar: "https://i.pravatar.cc/150?img=4",
        online: true,
        isBot: true,
        description: "I don't respond to messages.",
    },
];

io.on("connection", (socket: Socket) => {
    const userData = socket.handshake.query as unknown as User;
    const userId = userData.id;
    let user: User;

    const existingUser = users.find((u) => u.id === userId);
    if (existingUser) {
        user = existingUser;
        user.online = true;
    } else {
        user = {
            id: userId,
            name: userData.name,
            avatar: userData.avatar,
            online: true,
            isBot: false,
            description: userData.description,
        };
        users.push(user);
    }

    socket.join(user.id);

    const usersWithoutCurrent = users.filter((u) => u.id !== user.id);
    io.emit("updateUsers", [...usersWithoutCurrent, ...bots]);

    socket.on("requestMessageHistory", (recipientId: string) => {
        const messageHistory = messages.filter(
            (msg) =>
                (msg.sender === user.id && msg.recipient === recipientId) ||
                (msg.sender === recipientId && msg.recipient === user.id),
        );
        socket.emit("messageHistory", messageHistory);
    });

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

            messages.push(newMessage);
            io.to(recipient).emit("receiveMessage", newMessage);
            io.to(user.id).emit("receiveMessage", newMessage);

            handleBotResponse(recipient, newMessage);
        },
    );

    socket.on("disconnect", () => {
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            users[index].online = false;
        }
        io.emit("updateUsers", [
            ...users.filter((u) => u.id !== user.id),
            ...bots,
        ]);
    });
});

const handleBotResponse = (botId: string, message: Message) => {
    switch (botId) {
        case "bot-echo":
            sendBotMessage(botId, message.sender, message.text);
            break;
        case "bot-reverse":
            setTimeout(() => {
                sendBotMessage(
                    botId,
                    message.sender,
                    message.text.split("").reverse().join(""),
                );
            }, 3000);
            break;
    }
};

const sendBotMessage = (botId: string, recipient: string, text: string) => {
    const botMessage: Message = {
        sender: botId,
        recipient,
        text,
        time: new Date().toLocaleTimeString(),
    };

    messages.push(botMessage);
    io.to(recipient).emit("receiveMessage", botMessage);
};

const usersWithNextMessageTime: { [key: string]: number } = {};

setInterval(() => {
    const spamBot = bots.find((b) => b.id === "bot-spam");
    if (!spamBot) return;

    const onlineUsers = users.filter((u) => u.online);
    if (onlineUsers.length === 0) return;

    onlineUsers.forEach((user) => {
        const now = Date.now();
        const nextMessageTime = usersWithNextMessageTime[user.id] || now;

        if (now >= nextMessageTime) {
            const randomMessage = [
                "Hello!",
                "How are you?",
                "I'm a bot!",
                "Just checking in.",
                "Stay safe!",
            ][Math.floor(Math.random() * 5)];

            sendBotMessage("bot-spam", user.id, randomMessage);

            const randomDelay = Math.floor(Math.random() * (120000 - 10000) + 10000);
            usersWithNextMessageTime[user.id] = now + randomDelay;
        }
    });
}, 1000);

server.listen(3005, () => console.log("Server running on port 3005"));