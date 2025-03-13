import { User } from "../../../interfaces/user.interface";

interface ContactItemProps {
    user: User;
    onContactItemClick: (contactItem: User) => void;
    activeContactItem: User | null;
}

export const ContactItem = ({
    user,
    onContactItemClick,
    activeContactItem,
}: ContactItemProps) => (
    <div
        className={`flex items-center mb-3 gap-3 px-4 py-1 cursor-pointer hover:bg-gray-100 ${
            activeContactItem?.name === user.name ? "bg-gray-100" : ""
        }`}
        onClick={() => onContactItemClick(user)}
    >
        <div className="relative flex-shrink-0 w-[50px] h-[50px]">
            <img
                src={user.avatar}
                alt="avatar"
                className="rounded-sm w-full h-full object-cover"
            />
            <div
                className={`w-4 h-4 absolute ${
                    user.online ? "bg-green-500" : "bg-gray-400"
                } rounded-full -right-1 -bottom-1`}
            ></div>
        </div>
        <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-700 leading-5">
                {user.name}
            </div>
            <p className="text-sm leading-4 text-gray-400">
                {user.description.length > 50
                    ? user.description.slice(0, 50) + "..."
                    : user.description}
            </p>
        </div>
    </div>
);
