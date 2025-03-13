import { Message } from "../../../interfaces/message.interface";
import { User } from "../../../interfaces/user.interface";

interface MessageProps extends Message {
    me: User;
}

/* const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("ua-UA", {
        hour: "2-digit",
        minute: "2-digit",
    });
}; */

export const ChatMessage = ({ sender, text, time, me }: MessageProps) => {
    const isUser = sender === me.name;

    return (
        <div className={`max-w-4xl mt-5 ${isUser ? "ml-auto" : ""}`}>
            <div
                className={`rounded-t-md flex items-center justify-between py-2 px-4 ${
                    isUser ? "bg-[#f0cbb3]" : "bg-[#bdcbd9]"
                }`}
            >
                <span className="text-gray-700">{sender}</span>
                <span className="text-gray-400">{time}</span>
            </div>
            <div className="px-4 py-2 bg-white shadow-lg text-gray-700 rounded-b-md relative">
                <p>{text}</p>
                <div
                    className={`absolute ${
                        isUser ? "-right-2" : "-left-2"
                    } top-1/2 -translate-y-1/2 bg-white w-4 h-4 rotate-45`}
                ></div>
            </div>
        </div>
    );
};
