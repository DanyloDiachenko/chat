import { useState } from "react";
import { ContactItem } from "../../interfaces/contact-item.interface";
import { ContactItem as ContactItemComponent } from "./ContactItem";

interface SidebarProps {
    bots: ContactItem[];
    users: ContactItem[];
    onContactItemClick: (conactItem: ContactItem) => void;
    activeContactItem: ContactItem | null;
}

// ADD last seen time

export const Sidebar = ({
    bots,
    users,
    onContactItemClick,
    activeContactItem,
}: SidebarProps) => {
    const [activeTab, setActiveTab] = useState("bots");

    return (
        <div className="w-1/5 pb-6 bg-white flex flex-col min-h-full">
            <div className="grid grid-cols-2 mb-2">
                <button
                    className={`text-center pt-4 pb-1 ${
                        activeTab === "bots"
                            ? "text-gray-600"
                            : "text-gray-400 border-l border-b border-gray-300 bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("bots")}
                >
                    Bots
                </button>
                <button
                    className={`text-center pt-4 pb-1 ${
                        activeTab === "users"
                            ? "text-gray-600"
                            : "text-gray-400 border-l border-b border-gray-300 bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("users")}
                >
                    All
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                {(activeTab === "bots" ? bots : users).map((contact, index) => (
                    <ContactItemComponent
                        key={index}
                        {...contact}
                        onContactItemClick={onContactItemClick}
                        activeContactItem={activeContactItem}
                    />
                ))}
            </div>
            <div className="px-4 mt-auto">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border block w-full py-3 rounded-md px-3 focus:outline-blue-300 outline-2 text-gray-700"
                />
            </div>
        </div>
    );
};
