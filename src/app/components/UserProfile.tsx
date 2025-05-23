'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfileProps {
  userName?: string;
  userImage?: string;
}

export function UserProfile({ userName = 'User', userImage = '/default-avatar.png' }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={userImage}
            alt={userName}
            fill
            className="object-cover"
          />
        </div>
        <span className="text-sm font-medium text-gray-700">{userName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <button
            onClick={() => {
              // Add logout logic here
              console.log('Logout clicked');
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 