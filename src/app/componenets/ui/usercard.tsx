import React from 'react';
import { IconUserPlus, IconMessageCircle,  IconUser  } from '@tabler/icons-react';
import Image from 'next/image';

interface UserCardProps {
  uid: string;
  profileImage: string;
  firstname: string;
  lastname: string;
  online: boolean;
  onAddFriend?: (uid: string) => void;
  onChatStart?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ uid, profileImage, firstname, lastname, online, onAddFriend, onChatStart }) => {
  return (
    <div className="flex items-center p-3 dark:bg-neutral-700 dark:bg-gradient-to-l from-neutral-950 to-gray-900 shadow-md rounded-xl border-2 border-gray-800 transition-transform transform hover:scale-105">
      {profileImage ? (<Image
        src={profileImage}
        width={400}
        height={400}
        alt={`${firstname} ${lastname}`}
        className="w-16 h-16 rounded-full object-cover mr-4"
      />) : (
        <div className=" w-16 h-16 rounded-full object-cover mr-4 bg-neutral-900">
           <IconUser stroke={1.5} className='w-16 h-16 rounded-full object-cover mr-4 text-emerald-100' /> 
        </div>
      )}

      <div className="flex-1 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">{firstname} {lastname}</h3>
          <p className={`text-sm font-mono ${online ? 'text-green-500' : 'text-red-500'}`}>
            {online ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onChatStart && (
            <button
              className="text-blue-400 hover:text-blue-600 focus:outline-none"
              onClick={onChatStart}
              aria-label="Start Chat"
            >
              <IconMessageCircle stroke={1.25} size={24} />
            </button>
          )}
          {onAddFriend && (
            <button
              className="text-green-400 hover:text-emerald-800 focus:outline-none"
              onClick={() => onAddFriend(uid)}
              aria-label="Add Friend"
            >
              <IconUserPlus stroke={1.25} size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
