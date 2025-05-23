'use client';

import { useRouter } from 'next/navigation';
import { UserProfile } from './UserProfile';
import { useNavbar } from 'app/hooks/useNavbar';

interface NavbarProps {
  userName?: string;
  userImage?: string;
}

export function Navbar({
  userName,
  userImage,
}: NavbarProps) {
  const router = useRouter();
  const { pageTitle, showNavbar, showBackButton } = useNavbar();

  if(!showNavbar) return null;
  return (
    <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          {showBackButton && (
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center">
          <UserProfile userName={userName} userImage={userImage} />
        </div>
      </div>
    </div>
  </nav>
  )
}