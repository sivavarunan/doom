import React from 'react';
import Image from 'next/image';
import { IconUser, IconTrash, IconMessage } from '@tabler/icons-react';

interface FriendCardProps {
    uid: string;
    profileImage: string;
    firstname: string;
    lastname: string;
    online: boolean;
    onChatStart: () => void;
    onRemoveFriend: (uid: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ uid, profileImage, firstname, lastname, online, onChatStart, onRemoveFriend }) => {
    return (
        <div
            className="relative flex items-center justify-between p-4 mb-4 rounded-xl shadow-md cursor-pointer bg-white border-2 border-neutral-950 dark:bg-gradient-to-t from-neutral-950 to-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-700 w-96"
        > 
            <div className="flex items-center">
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
                        <div className='dark:bg-gradient-to-t from-neutral-900 to-black bg-white flex items-center justify-center'>
                            <IconUser stroke={1.5} className='w-12 h-12 rounded-full object-cover' />
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <h3 className="text-md font-semibold text-black dark:text-white">{firstname} {lastname}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{online ? 'Online' : 'Offline'}</p>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    className="text-teal-500 hover:text-emerald-700 ml-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        onChatStart();
                    }}
                    aria-label={`Start chat with ${firstname} ${lastname}`}
                >
                    <IconMessage size={20} />
                </button>
                <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFriend(uid);
                    }}
                    aria-label={`Remove ${firstname} ${lastname} from friends`}
                >
                    <IconTrash size={20} />
                </button>
            </div>
        </div>
    );
};

export default FriendCard;
