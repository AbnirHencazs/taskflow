"use client";

import { User } from "@prisma/client";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Welcome!</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-medium">User ID:</span> {user.id}
        </p>
      </div>
    </div>
  );
}
