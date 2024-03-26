import React from "react";
import Image from "next/image";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";

const PostCardComponent = ({ post }: { post: GetPostsByUserIdType }) => {
  return (
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
        </div>
        <p className="text-black dark:text-white block text-xl leading-snug mt-3">
          {post.content}
        </p>
        <div className="flex flex-wrap justify-center">
          {post.items.map((item) => (
            <div key={null} className="p-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.image.filename}`}
                // className="w-full h-auto"
                alt="Item"
                width={200}
                height={200}
              />
            </div>
          ))}
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
          10:05 AM · Dec 19, 2020
        </p>
        <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
        <div className="text-gray-500 dark:text-gray-400 flex mt-3">
          <div className="flex items-center mr-6">
            <span className="ml-3">615</span>
          </div>
          <div className="flex items-center mr-6">
            <span className="ml-3">93 people are Tweeting about this</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardComponent;
