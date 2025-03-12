const App = () => {
    return (
        <div className="h-screen flex flex-col items-center mt-6">
            <h1 className="text-4xl font-medium container">Chat bots 2.0</h1>
            <div className="w-full bg-[#586670] mt-3 py-6">
                <div className="flex container">
                    <div className="w-3/4 border-r flex flex-col">
                        <div className="flex items-center max-h-40">
                            <img
                                src="/patrick.png"
                                alt="bot avatar"
                                className="h-full aspect-square"
                            />
                            <div className="bg-[#bdcbd9] h-full px-4 py-2">
                                <h2 className="text-2xl font-medium">
                                    Reverse bot
                                </h2>
                                <p className="text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit Lorem ipsum
                                    dolor sit amet, consectetur adipiscing elit
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit Lorem ipsum dolor sit amet,
                                    consectetur adipiscing elit Lorem ipsum
                                    dolor sit amet, consectetur adipiscing elit
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#d6dfe7] p-6 rounded-lg overflow-y-auto">
                            <div className="max-w-4xl">
                                <div className="rounded-t-md flex items-center justify-between py-2 px-4 bg-[#bdcbd9]">
                                    <span className="text-gray-700">
                                        Reverse bot
                                    </span>
                                    <span className="text-gray-400">
                                        4:20 PM
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-white shadow-lg text-gray-700 rounded-b-md relative">
                                    <p>Hello world!</p>
                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-white w-4 h-4 rotate-45"></div>
                                </div>
                            </div>
                            <div className="max-w-4xl mt-5 ml-auto">
                                <div className="rounded-t-md flex items-center justify-between py-2 px-4 bg-[#f0cbb3]">
                                    <span className="text-gray-700">
                                        Username
                                    </span>
                                    <span className="text-gray-400">
                                        4:22 PM
                                    </span>
                                </div>
                                <div className="px-4 py-2 bg-white shadow-lg text-gray-700 rounded-b-md relative">
                                    <p>Hello robot!</p>
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white w-4 h-4 rotate-45"></div>
                                    <div className="absolute -bottom-6 text-sm text-gray-400 z-10">
                                        Seen 4:27 PM
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Start chatting!"
                                className="w-full p-2 border rounded-lg"
                            />
                            <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg">
                                Send message
                            </button>
                        </div>
                    </div>
                    {/* Right Panel - Bot List */}
                    <div className="w-1/4 p-4">
                        <div className="flex justify-between mb-2">
                            <button className="font-bold">Online</button>
                            <button className="text-gray-500">All</button>
                        </div>
                        {[
                            "Echo bot",
                            "Reverse bot",
                            "Spam bot",
                            "Ignore bot",
                        ].map((bot, index) => (
                            <div
                                key={index}
                                className="flex items-center mb-3 p-2 bg-gray-100 rounded-lg"
                            >
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                <div>
                                    <p className="font-semibold">{bot}</p>
                                    <p className="text-xs text-gray-500">
                                        Fusce dapibus, tellus ac cursus...
                                    </p>
                                </div>
                            </div>
                        ))}
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full p-2 border rounded-lg mt-4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
