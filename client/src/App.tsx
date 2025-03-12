const App = () => {
    return (
        <div className="flex flex-col items-center mt-6">
            <h1 className="text-4xl font-medium container">Chat bots 2.0</h1>
            <div className="w-full bg-[#586670] min-h-[93vh] mt-3 py-6">
                <div className="flex container">
                    <div className="w-4/5 border-r flex flex-col">
                        <div className="flex items-center max-h-40">
                            <img
                                src="/reverse-bot.png"
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
                        <div className="bg-[#d6dfe7] px-2 p-6">
                            <div className="flex-1 overflow-y-auto pl-4 pr-6 min-h-[55vh]">
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
                            <div className="text-center text-[#84aec6] mt-6">
                                Reverse bot is typing...
                            </div>
                            <form className="mt-4 flex w-full gap-3 px-4">
                                <input
                                    type="text"
                                    className="max-w-[75%] w-full rounded-md px-3 focus:outline-blue-300 outline-2 text-gray-700"
                                    placeholder="Start chatting!"
                                />
                                <button className="max-w-[25%] w-full bg-[#428bca] text-white py-3 rounded-md text-opacity-80">
                                    Send message
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="w-1/5 pb-4 bg-white">
                        <div className="grid grid-cols-2 mb-2">
                            <button className="text-gray-600 text-center pt-4 pb-1">
                                Online
                            </button>
                            <button className="text-gray-400 text-center border-l border-b border-gray-300 bg-gray-100 pt-4 pb-1">
                                All
                            </button>
                        </div>
                        {[
                            "Echo bot",
                            "Reverse bot",
                            "Spam bot",
                            "Ignore bot",
                        ].map((bot, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[50px_1fr] items-center mb-3 gap-3 px-4 py-1 cursor-pointer hover:bg-gray-100"
                            >
                                <div className="relative">
                                    <img
                                        src="/reverse-bot.png"
                                        alt="bot avatar"
                                        className="aspect-square rounded-sm"
                                    />
                                    <div className="w-4 h-4 absolute bg-green-500 rounded-full -right-1 -bottom-1"></div>
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-700 leading-5">
                                        {bot}
                                    </div>
                                    <p className="text-sm leading-4 text-gray-400">
                                        Fusce dapibus, tellus ac cursus Fusce
                                        dapibus, tellus ac cursus...
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div className="px-4 mt-auto">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="border block w-full py-2 rounded-md px-3 focus:outline-blue-300 outline-2 text-gray-700"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
