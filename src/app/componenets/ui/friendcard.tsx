import Image from 'next/image';

interface FriendCardProps {
    uid: string;
    profileImage: string;
    firstname: string;
    lastname: string;
    online: boolean;
    onChatStart: () => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ uid, profileImage, firstname, lastname, online, onChatStart }) => {
    return (
        <div
            className="flex items-center p-4 mb-4 rounded-xl shadow-md cursor-pointer bg-white border-2 border-neutral-950 dark:bg-gradient-to-t from-neutral-900 to-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 w-96"
            onClick={onChatStart}
        >
            <div className="w-12 h-12 rounded-full overflow-hidden">
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt={`${firstname} ${lastname}`}
                        className="object-cover w-full h-full"
                        width={400}
                        height={400}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}
            </div>
            <div className="ml-4">
                <h3 className="text-md font-semibold text-black dark:text-white">{firstname} {lastname}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{online ? 'Online' : 'Offline'}</p>
            </div>
        </div>
    );
};

export default FriendCard;
