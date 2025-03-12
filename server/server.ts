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
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
    {
        id: "bot-reverse",
        name: "Reverse Bot",
        avatar: "https://i.pravatar.cc/150?img=2",
        online: true,
        isBot: true,
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
    {
        id: "bot-spam",
        name: "Spam Bot",
        avatar: "https://i.pravatar.cc/150?img=3",
        online: true,
        isBot: true,
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
    },
    {
        id: "bot-ignore",
        name: "Ignore Bot",
        avatar: "https://i.pravatar.cc/150?img=4",
        online: true,
        isBot: true,
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
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

        const usersWithoutCurrent = users.filter((u) => u.id !== user.id);
        io.emit("updateUsers", [...usersWithoutCurrent, ...bots]);
    });
});

const handleBotResponse = (botName: string, message: Message) => {
    switch (botName) {
        case "Echo Bot":
            sendBotMessage(botName, message.sender, message.text);
            break;
        case "Reverse Bot":
            setTimeout(() => {
                sendBotMessage(
                    botName,
                    message.sender,
                    message.text.split("").reverse().join(""),
                );
            }, 3000);
            break;
    }
};

const sendBotMessage = (botName: string, recipient: string, text: string) => {
    const botMessage: Message = {
        sender: botName,
        recipient,
        text,
        time: new Date().toLocaleTimeString(),
    };

    messages.push(botMessage);
    io.to(users.find((u) => u.id === recipient)?.id || "").emit(
        "receiveMessage",
        botMessage,
    );
};

const randomSpamMessages = [
    "Hello!",
    "How are you?",
    "I'm a bot!",
    "Just checking in.",
    "Stay safe!",
];

setInterval(() => {
    const spamBot = bots.find((b) => b.name === "Spam Bot");
    if (!spamBot) return;

    const onlineUsers = users.filter((u) => u.online);
    if (onlineUsers.length === 0) return;

    const randomUser =
        onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
    const randomMessage =
        randomSpamMessages[
            Math.floor(Math.random() * randomSpamMessages.length)
        ];

    sendBotMessage("Spam Bot", randomUser.id, randomMessage);
}, Math.floor(Math.random() * (120000 - 10000) + 10000));

server.listen(3005, () => console.log("Server running on port 3005"));
