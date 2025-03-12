import { ContactItem as IContactItem } from "../../../interfaces/contact-item.interface";

interface ContactItemProps extends IContactItem {}

export const ContactItem = ({
    name,
    avatar,
    description,
}: ContactItemProps) => (
    <div className="grid grid-cols-[50px_1fr] items-center mb-3 gap-3 px-4 py-1 cursor-pointer hover:bg-gray-100">
        <div className="relative">
            <img
                src={avatar}
                alt="avatar"
                className="aspect-square rounded-sm"
            />
            <div className="w-4 h-4 absolute bg-green-500 rounded-full -right-1 -bottom-1"></div>
        </div>
        <div>
            <div className="font-semibold text-gray-700 leading-5">{name}</div>
            <p className="text-sm leading-4 text-gray-400">{description}</p>
        </div>
    </div>
);
