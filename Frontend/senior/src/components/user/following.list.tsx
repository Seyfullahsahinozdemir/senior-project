import React from "react";
import Image from "next/image";
import { User } from "@/interfaces/User";

const FollowingList = ({ followingList }: { followingList: User[] }) => {
  return (
    <div className="bg-gray-200 p-4 w-64 h-screen overflow-y-auto">
      <p>Following List</p>
      {followingList &&
        followingList.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md p-4 my-2 flex items-center"
          >
            {user.preferences && user.preferences.image && (
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user.preferences.image.filename}`}
                width={100}
                height={100}
                alt="profile pic"
                className="w-16 h-16"
              />
            )}
            <span>
              {user.firstName} {user.lastName} @{user.username}
            </span>
          </div>
        ))}
    </div>
  );
};

export default FollowingList;
