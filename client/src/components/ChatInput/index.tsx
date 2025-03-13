import { FormEvent, useState } from "react";
import { User } from "../../interfaces/user.interface";

interface ChatInputProps {
    onSend: (message: string) => void;
    isTyping: boolean;
    activeContactItem: User;
    message: string;
    setMessage: (message: string) => void;
}

export const ChatInput = ({
    onSend,
    isTyping,
    activeContactItem,
    message,
    setMessage,
}: ChatInputProps) => {
    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="mt-4 pt-6 relative">
            <div className="text-blue-700 absolute -top-2 -left-1/2 -right-1/2 translate-x-1/2">
                {isTyping ? `${activeContactItem.name} is typing...` : ""}
            </div>
            <form className="flex w-full gap-3 px-4" onSubmit={handleSend}>
                <input
                    type="text"
                    className="max-w-[75%] w-full py-3 rounded-md px-3 focus:outline-blue-300 outline-2 text-gray-700"
                    placeholder="Start chatting!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    type="submit"
                    className="max-w-[25%] w-full bg-[#428bca] text-white py-3 rounded-md text-opacity-80"
                >
                    Send message
                </button>
            </form>
        </div>
    );
};
