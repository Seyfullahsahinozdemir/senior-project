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
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  };

  return (
    <>
      <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
        {posts?.map((post) => (
          <SimplePostCardComponent key={post._id} post={post} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <LoadMoreButton onClick={handleLoadMorePosts} />
      </div>
    </>
  );
};

export default PostsByItemPage;
