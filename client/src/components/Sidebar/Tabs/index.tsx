interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
    return (
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
    );
};
