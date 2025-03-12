import { FormEvent, useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
    const [message, setMessage] = useState("");

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <form className="mt-4 flex w-full gap-3 px-4" onSubmit={handleSend}>
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
    );
};
