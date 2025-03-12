interface ConversationHeaderProps {
    name: string;
    avatar: string;
    description: string;
}

export const ConversationHeader = ({
    name,
    avatar,
    description,
}: ConversationHeaderProps) => (
    <div className="flex items-center max-h-40">
        <img
            src={avatar}
            alt="avatar"
            className="h-full aspect-square"
            height={160}
            width={160}
        />
        <div className="bg-[#bdcbd9] h-full w-full px-4 py-2">
            <h2 className="text-2xl font-medium">{name}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);
