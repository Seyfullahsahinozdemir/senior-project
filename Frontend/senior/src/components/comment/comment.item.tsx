import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineDelete, AiOutlineLike } from "react-icons/ai";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import {
  likeCommentEndPoint,
  unLikeCommentEndPoint,
} from "@/network/endpoints";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { toast } from "react-toastify";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { Comment } from "@/interfaces/Comment";
import { getDevUrl } from "@/network/endpoints";
import DeleteCommentModal from "../modal/delete.comment.modal";

const CommentItemComponent = ({
  comment,
  postId,
  handleRemoveComment,
}: {
  comment: Comment;
  postId: string;
  handleRemoveComment: (comment: Comment) => void;
}) => {
  const { formatDate } = useFormattedDate();
  const [liked, setLiked] = useState<boolean>(comment.liked ?? false);
  const [likeCount, setLikeCount] = useState<number>(comment.likeCount ?? 0);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  const handleLikeClick = async () => {
    try {
      if (comment.me) {
        toast.error("You cannot like your posts.");
        return;
      }

      if (liked) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(unLikeCommentEndPoint),
          {
            commentId: comment._id,
            postId,
          }
        );

        if (response.success) {
          setLiked(false);
          setLikeCount((prevCount) => prevCount - 1);
        } else {
          response.data.errors.forEach((err: string) => {
            toast.error(err);
          });
        }
      } else {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(likeCommentEndPoint),
          {
            commentId: comment._id,
            postId,
          }
        );

        if (response.success) {
          setLiked(true);
          setLikeCount((prevCount) => prevCount + 1);
        } else {
          response.data.errors.forEach((err: string) => {
            toast.error(err);
          });
        }
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleRemoveClick = () => {
    if (!comment.me) {
      toast.error("You cannot delete a comment that not belongs to you.");
      return;
    }
    setShowDeleteModal(true);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteCommentModal
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          onDeleteComment={handleRemoveComment}
          comment={comment}
        />
      )}
      <article className="p-6 text-base bg-white rounded-lg dark:bg-gray-900 border-t border-gray-200">
        <footer className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
              <Image
                className="mr-2 w-6 h-6 rounded-full"
                width={100}
                height={100}
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${comment.createdBy.preferences.image?.filename}`}
                alt={comment.createdBy._id}
              />
              {comment.createdBy.firstName} {comment.createdBy.lastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDate(comment.createdAt, true)}
            </p>
          </div>
          <div
            onClick={handleRemoveClick}
            className="cursor-pointer hover:shadow-2xl"
          >
            <AiOutlineDelete className="text-red-600 dark:text-red-500 text-2xl rounded-full" />
          </div>
        </footer>
        <p className="text-gray-500 dark:text-gray-400">{comment.content}</p>
        <div className="text-gray-500 dark:text-gray-400 flex mt-3">
          <div
            className={`flex items-center cursor-pointer`}
            onClick={handleLikeClick}
          >
            <AiOutlineLike
              className={`text-gray-600 dark:text-gray-300 ${
                liked && "text-red-500"
              }`}
            />
            <span className="ml-1">{likeCount}</span>
          </div>
        </div>
      </article>
    </>
  );
};

export default CommentItemComponent;
