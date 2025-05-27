"use client";

import { useRouter } from "next/navigation";
import { UserProfile } from "./UserProfile";
import { useNavbar } from "app/hooks/useNavbar";
import Image from "next/image";

interface NavbarProps {
  userName?: string;
  userImage?: string;
}

export function Navbar({ userName, userImage }: NavbarProps) {
  const router = useRouter();
  const { pageTitle, showNavbar, showBackButton } = useNavbar();

  if (!showNavbar) return null;
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-1">
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="mr-2 sm:mr-4 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
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
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {pageTitle}
            </h1>
          </div>

          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity rounded-xl"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH}/TaskFlowLogo.png`}
                alt="TaskFlow Logo"
                width={32}
                height={32}
                quality={100}
                className="h-4 w-auto rounded-full"
              />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </button>
          </div>

          <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-1"
            >
              <Image
                src="/TaskFlowLogo.png"
                alt="TaskFlow Logo"
                width={24}
                height={24}
                quality={100}
                className="h-6 w-auto rounded-full"
              />
            </button>
          </div>

          <div className="flex items-center flex-1 justify-end">
            <UserProfile userName={userName} userImage={userImage} />
          </div>
        </div>
      </div>
    </nav>
  );
}
