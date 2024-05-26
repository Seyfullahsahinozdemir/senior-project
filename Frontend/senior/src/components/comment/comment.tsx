import { Comment } from "@/interfaces/Comment";
import React from "react";
import CommentItemComponent from "./comment.item";
import LoadMoreButton from "../common/load.button";
import { DiVim } from "react-icons/di";

const CommentComponent = ({
  postId,
  comments,
  handleLoadMoreComments,
  handlePostComment,
  content,
  setContent,
  handleRemoveComment,
}: {
  postId: string;
  comments: Comment[];
  handleLoadMoreComments: () => void;
  handlePostComment: () => void;
  content: string;
  setContent: (content: string) => void;
  handleRemoveComment: (comment: Comment) => void;
}) => {
  return (
    <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Comments
          </h2>
        </div>
        <div className="mb-6">
          <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={6}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-gray-800 bg-white border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-50"
            onClick={handlePostComment}
          >
            Post comment
          </button>
        </div>

        {comments &&
          comments.length > 0 &&
          comments.map((comment) => (
            <CommentItemComponent
              key={comment._id}
              comment={comment}
              postId={postId}
              handleRemoveComment={handleRemoveComment}
            />
          ))}

        {comments && comments.length > 0 ? (
          <div className="flex items-center justify-center">
            <LoadMoreButton onClick={handleLoadMoreComments} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="font-bold text-gray-500">No comments found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentComponent;
