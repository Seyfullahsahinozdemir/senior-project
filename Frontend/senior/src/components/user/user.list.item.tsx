import React from "react";
import Image from "next/image";
import { User } from "@/interfaces/User";

const UserListItem = ({ user }: { user: User }) => {
  return (
    <li className="bg-white shadow-md p-4 my-4 flex items-center mx-auto w-80 rounded-lg cursor-pointer transition duration-300 ease-in-out hover:shadow-lg">
      {user.preferences && user.preferences.image && (
        <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user.preferences.image.filename}`}
            width={100}
            height={100}
            alt="profile pic"
            className="object-cover"
          />
        </div>
      )}
      <div>
        <span className="text-lg font-semibold">
          {user.firstName} {user.lastName}
        </span>
        <span className="block text-gray-500">@{user.username}</span>
      </div>
    </li>
  );
};

export default UserListItem;
