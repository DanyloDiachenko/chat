import { ContactItem } from "../../interfaces/contact-item.interface";

interface ConversationHeaderProps {
    activeContactItem: ContactItem | null;
}

export const ConversationHeader = ({ activeContactItem }: ConversationHeaderProps) => (
    <div className="flex items-center h-40">
        {activeContactItem ? (
            <>
                <img
                    src={activeContactItem?.avatar}
                    alt="avatar"
                    className="h-40 aspect-square"
                    height={160}
                    width={160}
                />
                <div className="bg-[#bdcbd9] h-full w-full px-4 py-2">
                    <h2 className="text-2xl font-medium">
                        {activeContactItem?.name}
                    </h2>
                    <p className="text-gray-600">
                        {activeContactItem?.description}
                    </p>
                </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center bg-[#bdcbd9] h-full">
                <div className="text-gray-600 text-2xl">Select a contact</div>
            </div>
        )}
    </div>
);
