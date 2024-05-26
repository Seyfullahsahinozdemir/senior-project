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

const FollowingList: React.FC<Props> = ({
  followingList,
  onUserSelect,
  selectedUser,
}) => {
  const router = useRouter();

  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  return (
    <div className="bg-gray-50 p-4 w-64 h-screen overflow-y-auto">
      <p className="text-lg font-semibold mb-4">Following List</p>
      {followingList && followingList.length > 0 ? (
        followingList.map((user) => (
          <div
            key={user._id}
            className={`bg-white p-4 my-2 flex items-center cursor-pointer hover:bg-gray-50 shadow-md rounded-lg ${
              selectedUser === user._id ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => onUserSelect(user._id)}
            style={{ position: "relative" }}
          >
            <div
              className="cursor-pointer absolute top-0 right-0 p-2 transition duration-300 ease-in-out hover:bg-gray-300 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleUserClick(user._id);
              }}
            >
              <FaHome className="h-6 w-6 text-gray-400" />
            </div>

            {user.preferences && user.preferences.image && (
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user.preferences.image.filename}`}
                  layout="fill"
                  objectFit="cover"
                  alt="profile pic"
                  className="rounded-full"
                />
              </div>
            )}
            <span className="text-sm">
              {user.firstName} {user.lastName} (@{user.username})
            </span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">You can find some users by searching.</p>
      )}
    </div>
  );
};

export default FollowingList;
