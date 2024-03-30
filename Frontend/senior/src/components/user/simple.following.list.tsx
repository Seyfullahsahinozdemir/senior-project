import React from "react";
import Image from "next/image";
import { User } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";

interface Props {
  followingList: User[];
  onUserSelect: (userId: string) => void;
  selectedUser: string;
}

const NarrowFollowingListComponent: React.FC<Props> = ({
  followingList,
  onUserSelect,
  selectedUser,
}) => {
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {followingList &&
        followingList.map((user) => (
          <div
            key={user._id}
            className={`bg-white p-4 my-2 flex items-center cursor-pointer hover:bg-gray-100 shadow-md rounded-lg ${
              selectedUser === user._id ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => onUserSelect(user._id)}
          >
            {user.preferences && user.preferences.image && (
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
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
              <div
                className="flex justify-end"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(user._id);
                }}
              >
                <FaHome className="text-gray-400 w-8 h-8 p-1 transition duration-300 ease-in-out hover:bg-gray-300 rounded-full" />
              </div>
              <h2 className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NarrowFollowingListComponent;
