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
        className={`grid grid-cols-[50px_1fr] items-center mb-3 gap-3 px-4 py-1 cursor-pointer hover:bg-gray-100 ${
            activeContactItem?.name === user.name ? "bg-gray-100" : ""
        }`}
        onClick={() => onContactItemClick(user)}
    >
        <div className="relative">
            <img
                src={user.avatar}
                alt="avatar"
                className="h-[50px] w-[50px] rounded-sm"
            />
            <div className="w-4 h-4 absolute bg-green-500 rounded-full -right-1 -bottom-1"></div>
        </div>
        <div>
            <div className="font-semibold text-gray-700 leading-5">
                {user.name}
            </div>
            <p className="text-sm leading-4 text-gray-400">
                {user.description}
            </p>
        </div>
    </div>
);
