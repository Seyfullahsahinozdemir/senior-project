"use client";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import { getDevUrl, getPostsByItemId } from "@/network/endpoints";
import NetworkManager from "@/network/network.manager";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import SimplePostCardComponent from "@/components/post/simple.post.card.component";
import LoadMoreButton from "@/components/common/load.button";
import { toast } from "react-toastify";

const PostsByItemPage = () => {
  const pathname = usePathname();
  const itemId = pathname.split("/").pop();
  const [posts, setPosts] = useState<GetPostsByUserIdType[]>([]);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    networkManager
      .post(getDevUrl(getPostsByItemId), {
        itemId: itemId,
        pageIndex: 0,
        pageSize: 5,
      })
      .then((response: ICustomResponse) => {
        if (response.success) {
          setPosts(response.data);
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  const handleLoadMorePosts = () => {
    networkManager
      .post(getDevUrl(getPostsByItemId), {
        itemId: itemId,
        pageIndex: page + 1,
        pageSize: 5,
      })
      .then((response: ICustomResponse) => {
        if (response.success) {
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
          setPage((prevPage) => prevPage + 1);
        } else {
          toast.error(`Error: ${response.data.errors}`);
          return;
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  };

  return (
    <div className="bg-gray-50">
      {posts && posts.length > 0 ? (
        // grid grid-cols-1 gap-3 pt-4 w-11/12
        <div className="w-3/5 mx-auto">
          {posts.map((post) => (
            <SimplePostCardComponent key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center pt-4">
          <p className="text-gray-500">
            No posts found that match the search criteria.
          </p>
        </div>
      )}
      <div className="flex justify-center py-4">
        <LoadMoreButton onClick={handleLoadMorePosts} />
      </div>
    </div>
  );
};

export default PostsByItemPage;
