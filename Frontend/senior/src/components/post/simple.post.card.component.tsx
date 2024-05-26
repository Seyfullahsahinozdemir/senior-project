import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { likePostEndPoint, unLikePostEndPoint } from "@/network/endpoints";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { toast } from "react-toastify";
import { getDevUrl } from "@/network/endpoints";
import { useRouter } from "next/navigation";

const SimplePostCardComponent = ({ post }: { post: GetPostsByUserIdType }) => {
  const { formatDate } = useFormattedDate();
  const [liked, setLiked] = useState<boolean>(post.liked ?? false);

  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const router = useRouter();

  console.log(post);

  const handleLikeClick = async () => {
    try {
      console.log(liked);
      if (liked) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(unLikePostEndPoint),
          {
            postId: post._id,
          }
        );

        if (response.success) {
          console.log(response.data);
          setLiked(false);
          post.likeCount--;
        } else {
          toast.error(response.data.errors);
        }
      } else {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(likePostEndPoint),
          {
            postId: post._id,
          }
        );

        if (response.success) {
          console.log(response.data);
          setLiked(true);
          post.likeCount++;
        } else {
          toast.error(response.data.errors);
        }
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleCommentClick = () => {
    router.push(`/post/${post._id}`);
  };

  return (
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
        </div>
        <p className="block text-lg leading-snug mt-3 font-thin py-3 ml-4">
          {post.content}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {post.items.map((item, index) => (
            <div
              key={index}
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
          <div
            className="flex items-center mr-6 cursor-pointer"
            onClick={handleLikeClick}
          >
            <AiOutlineLike
              className={`text-gray-600 ${liked && "text-red-500"}`}
            />
            <span className="ml-1">{post.likeCount}</span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleCommentClick}
          >
            <AiOutlineComment className="text-gray-600" />
            <span className="ml-1">{post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePostCardComponent;
