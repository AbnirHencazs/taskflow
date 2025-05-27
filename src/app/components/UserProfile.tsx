"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfileProps {
  userName?: string;
  userImage?: string;
}

export function UserProfile({
  userName = "User",
  userImage = "/default-avatar.png",
}: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Close the dropdown
      setIsOpen(false);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=random&length=1&rounded=true&bold=true&color=random` ||
              userImage
            }
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
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
