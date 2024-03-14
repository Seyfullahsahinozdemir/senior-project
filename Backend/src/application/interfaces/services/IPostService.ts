import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { CommentPostDTO } from '@application/dto/post/comment.post';
import { DeleteCommentPostDTO } from '@application/dto/post/delete.comment.post';
import { LikeCommentPostDTO } from '@application/dto/post/like.comment.post';
import { RequestPostDTO } from '@application/dto/post/request.post';
import { Post } from '@domain/entities';
import { Comment } from '@domain/entities/comment';

export interface IPostService {
  getPosts(request: PaginatedRequest, currentUserId: string): Promise<Post[]>;
  createPost(request: RequestPostDTO, currentUserId: string): Promise<Post>;
  deletePost(_id: string, currentUserId: string): Promise<void>;

  likePost(_id: string, currentUserId: string): Promise<void>;
  unlikePost(_id: string, currentUserId: string): Promise<void>;

  getComments(request: PaginatedRequest, postId: string): Promise<Comment[]>;
  createComment(request: CommentPostDTO, currentUserId: string): Promise<Post>;
  deleteComment(request: DeleteCommentPostDTO): Promise<void>;

  likeComment(request: LikeCommentPostDTO, currentUserId: string): Promise<void>;
  unlikeComment(request: LikeCommentPostDTO, currentUserId: string): Promise<void>;
}
