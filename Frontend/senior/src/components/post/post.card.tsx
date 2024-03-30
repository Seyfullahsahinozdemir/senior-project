import React, { useState } from "react";
import Image from "next/image";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiOutlineDelete,
} from "react-icons/ai";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import DeletePostModal from "../modal/delete.post.modal";

const PostCardComponent = ({
  post,
  handleRemovePost,
}: {
  post: GetPostsByUserIdType;
  handleRemovePost: (post: GetPostsByUserIdType) => void;
}) => {
  const { formatDate } = useFormattedDate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <>
      {showDeleteModal && (
        <DeletePostModal
          post={post}
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          onDeletePost={handleRemovePost}
        />
      )}
      <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${post.user.image.filename}`}
                className="h-11 w-11 rounded-full"
                width={100}
                height={100}
                alt="profile-pic"
              />
              <div className="ml-1.5 text-sm leading-tight">
                <span className="text-black dark:text-white font-bold block ">
                  {`${post.user.firstName} ${post.user.lastName}`}
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-normal block">
                  {`${post.user.username}`}
                </span>
              </div>
            </div>
            <div
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer hover:shadow-2xl"
            >
              <AiOutlineDelete className="text-red-600 dark:text-red-500 text-2xl rounded-full" />
            </div>
          </div>
          <p className="text-black dark:text-white block text-xl leading-snug mt-3">
            {post.content}
          </p>
          <div className="flex flex-wrap justify-center">
            {post.items.map((item) => (
              <div key={null} className="p-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.image.filename}`}
                  alt="Item"
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
            {formatDate(post.createdAt, true)}
          </p>
          <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
          <div className="text-gray-500 dark:text-gray-400 flex mt-3">
            <div className="flex items-center mr-6">
              <AiOutlineLike className="text-gray-600 dark:text-gray-300" />
              <span className="ml-1">{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <AiOutlineComment className="text-gray-600 dark:text-gray-300" />
              <span className="ml-1">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCardComponent;
