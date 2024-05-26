"use client";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import NetworkManager from "@/network/network.manager";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  getDevUrl,
  getCommentsEndPoint,
  getPostByIdEndPoint,
  createCommentEndPoint,
  deleteCommentEndPoint,
} from "@/network/endpoints";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import SimplePostCardComponent from "@/components/post/simple.post.card.component";
import { Comment } from "@/interfaces/Comment";
import CommentComponent from "@/components/comment/comment";
import { toast } from "react-toastify";

const PostDetailPage = () => {
  const pathname = usePathname();
  const postId = pathname.split("/").pop();
  const [post, setPost] = useState<GetPostsByUserIdType | null>(null);
  const [page, setPage] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const [comments, setComments] = useState<Comment[]>([]);
  const { handleErrorResponse } = useErrorHandling();

  const networkManager: NetworkManager = useAxiosWithAuthentication();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse: ICustomResponse = await networkManager.post(
          getDevUrl(getPostByIdEndPoint),
          {
            postId,
          }
        );

        if (!postResponse.success) {
          toast.error(postResponse.data.errors);
          return;
        }

        setPost(postResponse.data);

        await loadComments();
      } catch (error) {
        handleErrorResponse(error);
      }
    };

    fetchPostAndComments();
  }, []);

  const loadComments = async () => {
    try {
      const commentsResponse: ICustomResponse = await networkManager.post(
        getDevUrl(getCommentsEndPoint),
        {
          pageSize: 5,
          pageIndex: 0,
          postId,
        }
      );

      if (!commentsResponse.success) {
        toast.error(commentsResponse.data.errors);
        return;
      }

      setComments(commentsResponse.data);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleLoadMoreComments = async () => {
    const response: ICustomResponse = await networkManager.post(
      getDevUrl(getCommentsEndPoint),
      {
        pageSize: 5,
        pageIndex: page,
        postId,
      }
    );
    setPage((prevPage) => prevPage + 1);

    if (response.success) {
      console.log(response.data);
      setComments((prevComments) => [...prevComments, ...response.data]);
    }
  };

  const handlePostComment = async () => {
    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(createCommentEndPoint),
        {
          postId,
          content: content,
        }
      );

      if (response.success) {
        setPage(0);
        const commentsResponse: ICustomResponse = await networkManager.post(
          getDevUrl(getCommentsEndPoint),
          {
            pageSize: 5,
            pageIndex: 0,
            postId: post?._id,
          }
        );
        setComments(commentsResponse.data);
        setPage((prevPage) => prevPage + 1);

        const postResponse: ICustomResponse = await networkManager.post(
          getDevUrl(getPostByIdEndPoint),
          {
            postId,
          }
        );

        if (!postResponse.success) {
          toast.error(postResponse.data.errors);
          return;
        }

        setPost(postResponse.data);

        toast.success(commentsResponse.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleRemoveComment = async (comment: Comment) => {
    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(deleteCommentEndPoint),
        { postId, commentId: comment._id }
      );

      if (response.success) {
        toast.success(response.message);
        loadComments();
      } else {
        toast.error(`Error: ${response.data.errors}`);
        return;
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <>
      <div className="w-3/4 mx-auto justify-center items-center mb-4">
        {post && <SimplePostCardComponent post={post} />}
      </div>

      <CommentComponent
        content={content}
        setContent={setContent}
        handlePostComment={handlePostComment}
        handleLoadMoreComments={handleLoadMoreComments}
        comments={comments}
        postId={post?._id as string}
        handleRemoveComment={handleRemoveComment}
      />
    </>
  );
};

export default PostDetailPage;
