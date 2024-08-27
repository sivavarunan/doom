import React from 'react';
import { IconUserPlus } from '@tabler/icons-react';

interface UserCardProps {
  uid: string;
  profileImage: string;
  firstname: string;
  lastname: string;
  online: boolean;
  onAddFriend?: (uid: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ uid, profileImage, firstname, lastname, online, onAddFriend }) => {
  return (
    <div className="flex items-center p-4 bg-neutral-700 dark:bg-gradient-to-l from-neutral-900 to-gray-800 shadow-md rounded-xl border-2 border-gray-700 transition-transform transform hover:scale-105">
      <img
        src={profileImage}
        alt={`${firstname} ${lastname}`}
        className="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div className="flex-1 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">{firstname} {lastname}</h3>
          <p className={`text-sm font-mono ${online ? 'text-green-500' : 'text-red-500'}`}>
            {online ? 'Online' : 'Offline'}
          </p>
        </div>
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
  );
};

export default UserCard;
