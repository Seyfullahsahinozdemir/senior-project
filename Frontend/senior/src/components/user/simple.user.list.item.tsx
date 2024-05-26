import React from "react";
import Image from "next/image";
import { User } from "@/interfaces/User";
import { useRouter } from "next/navigation";

const NarrowUserListItem = ({ user }: { user: User }) => {
  const router = useRouter();
  return (
    <li
      onClick={() => router.push(`/user/${user._id}`)}
      className="bg-white shadow-md p-1 my-2 flex items-center mx-auto w-48 rounded-lg transition duration-300 ease-in-out hover:shadow-lg"
    >
      {user.preferences && user.preferences.image && (
        <div className="w-14 h-14 mr-2 overflow-hidden rounded-full">
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

export default NarrowUserListItem;
