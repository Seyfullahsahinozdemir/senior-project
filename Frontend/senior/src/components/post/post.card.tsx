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
  const [showFullContent, setShowFullContent] = useState<boolean>(false);

  const renderContent = () => {
    if (!post.content) return;
    if (post.content.length <= 100) {
      return post.content;
    }

    if (showFullContent) {
      return (
        <>
          {post.content}{" "}
          <button
            onClick={() => setShowFullContent(false)}
            className="text-blue-600 hover:underline"
          >
            Show less
          </button>
        </>
      );
    } else {
      return (
        <>
          {post.content.substring(0, 100)}...{" "}
          <button
            onClick={() => setShowFullContent(true)}
            className="text-blue-600 hover:underline"
          >
            Show more
          </button>
        </>
      );
    }
  };

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
      <div className="bg-gray-50 p-10 items-center justify-center rounded-3xl hover:shadow-xl">
        <div className="bg-white border-gray-200 p-4 rounded-xl border">
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
                <span className="text-black font-bold block ">
                  {`${post.user.firstName} ${post.user.lastName}`}
                </span>
                <span className="text-gray-500 font-normal block">
                  {`${post.user.username}`}
                </span>
              </div>
            </div>
            <div
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer hover:shadow-2xl"
            >
              <AiOutlineDelete className="text-red-600 text-2xl rounded-full" />
            </div>
          </div>
          <p className="block text-lg leading-snug mt-3 font-thin py-3 ml-4">
            {renderContent()}
          </p>
          <div className="flex flex-wrap gap-8 ml-8">
            {post.items.map((item, index) => (
              <div
                key={item._id || index}
                className="p-2 border-2 w-64 h-64 flex justify-center items-center hover:shadow-lg"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.image.filename}`}
                  alt="Item"
                  width={150}
                  height={150}
                />
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-base py-1 my-0.5">
            {formatDate(post.createdAt, true)}
          </p>
          <div className="border-gray-200 border border-b-0 my-1"></div>
          <div className="text-gray-500 flex mt-3">
            <div className="flex items-center mr-6">
              <AiOutlineLike />
              <span className="ml-1">{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <AiOutlineComment />
              <span className="ml-1">{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCardComponent;
