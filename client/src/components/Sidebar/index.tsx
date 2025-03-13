import { useState } from "react";
import { ContactItem as ContactItemComponent } from "./ContactItem";
import { User } from "../../interfaces/user.interface";
import { Tabs } from "./Tabs";

interface SidebarProps {
    bots: User[];
    users: User[];
    onContactItemClick: (conactItem: User) => void;
    activeContactItem: User | null;
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
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 overflow-auto">
                {(activeTab === "bots" ? bots : users).map((contact, index) => (
                    <ContactItemComponent
                        key={index}
                        user={contact}
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
