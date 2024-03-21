import React from "react";
import Image from "next/image";
import { User } from "@/interfaces/User";

const UserListItem = ({ user }: { user: User }) => {
  console.log(user);
  return (
    <li className="bg-white shadow-md p-2 my-2 flex items-center w-7/8 mx-auto">
      {user.preferences && user.preferences.image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user.preferences.image.filename}`}
          width={100}
          height={100}
          alt="profile pic"
          className="w-16 h-16"
        />
      )}
      <div>
        <span>
          {user.firstName} {user.lastName} @{user.username}
        </span>
      </div>
    </li>
  );
};

export default UserListItem;
