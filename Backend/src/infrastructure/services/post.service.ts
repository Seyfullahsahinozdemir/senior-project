import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { CommentPostDTO } from '@application/dto/post/comment.post';
import { DeleteCommentPostDTO } from '@application/dto/post/delete.comment.post';
import { LikeCommentPostDTO } from '@application/dto/post/like.comment.post';
import { RequestPostDTO } from '@application/dto/post/request.post';
import { NotFoundException, ValidationException } from '@application/exceptions';
import { IPostService, IUserService } from '@application/interfaces';
import { IPostRepository } from '@application/persistence';
import { Post } from '@domain/entities';
import { Comment } from '@domain/entities/comment';

export class PostService implements IPostService {
  public readonly postRepository: IPostRepository;
  public readonly userService: IUserService;

  constructor({ postRepository, userService }: { postRepository: IPostRepository; userService: IUserService }) {
    this.postRepository = postRepository;
    this.userService = userService;
  }

  async getComments(request: PaginatedRequest, postId: string): Promise<Comment[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comments = post.comments || [];
    comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const startIndex = pageIndex * pageSize;
    const paginatedComments = comments.slice(startIndex, startIndex + pageSize);

    return paginatedComments;
  }

  async getPosts(request: PaginatedRequest, currentUserId: string): Promise<Post[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const followingList = await this.userService.getFollowing(currentUserId);
    const followingUserIds = followingList.map((user) => user._id);

    const posts = await this.postRepository.find({ createdBy: { $in: followingUserIds } }, pageIndex, pageSize, {
      createdAt: -1,
    });

    return posts;
  }

  async createPost(request: RequestPostDTO, currentUserId: string): Promise<Post> {
    const post = new Post(request.content, request.items);
    post.create(currentUserId);

    return await this.postRepository.create(post);
  }

  async deletePost(_id: string, currentUserId: string): Promise<void> {
    const deletedPost = await this.postRepository.delete(_id);
    if (!deletedPost) {
      throw new NotFoundException('Post not found');
    }
    deletedPost.delete(currentUserId);
  }

  async likePost(_id: string, currentUserId: string): Promise<void> {
    const post = await this.postRepository.findOne(_id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.likes?.includes(currentUserId)) {
      throw new ValidationException('You cannot like your posts or cannot like again.');
    }
    post.likes?.push(currentUserId);
    await this.postRepository.update(_id, post);
  }

  async unlikePost(_id: string, currentUserId: string): Promise<void> {
    const post = await this.postRepository.findOne(_id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.likes?.includes(currentUserId)) {
      throw new ValidationException('No user post-like relation found.');
    }
    post.likes = post.likes?.filter((userId) => userId !== currentUserId);
    await this.postRepository.update(_id, post);
  }

  async createComment(request: CommentPostDTO, currentUserId: string): Promise<Post> {
    const post = await this.postRepository.findOne(request.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    const comment = new Comment(request.content, currentUserId);
    post.comments?.push(comment);
    return await this.postRepository.update(post._id?.toString() as string, post);
  }

  async deleteComment(request: DeleteCommentPostDTO): Promise<void> {
    const post = await this.postRepository.findOne(request.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (!post.comments) {
      throw new NotFoundException('No comment found.');
    }
    const index = post.comments?.findIndex((comment) => comment._id?.toString() === request.commentId);

    if (index === -1) {
      throw new NotFoundException('No comment found.');
    }

    post.comments.splice(index, 1);
    await this.postRepository.update(post._id?.toString() as string, post);
  }

  async likeComment(request: LikeCommentPostDTO, currentUserId: string): Promise<void> {
    const post = await this.postRepository.findOne(request.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (!post.comments) {
      throw new NotFoundException('No comment found.');
    }
    const comment = post.comments.find((comment) => comment._id?.toString() === request.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    if (!comment.likes) {
      comment.likes = [];
    }
    if (comment.likes.includes(currentUserId) || comment.createdBy == currentUserId) {
      throw new ValidationException('You cannot like a comment more than one or cannot like your comment.');
    }
    comment.likes.push(currentUserId);
    await this.postRepository.update(request.postId, post);
  }

  async unlikeComment(request: LikeCommentPostDTO, currentUserId: string): Promise<void> {
    const post = await this.postRepository.findOne(request.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (!post.comments) {
      throw new NotFoundException('No comments found.');
    }
    const comment = post.comments.find((comment) => comment._id?.toString() === request.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    if (!comment.likes) {
      throw new NotFoundException('No likes found for the comment.');
    }

    const index = comment.likes.indexOf(currentUserId);
    if (index === -1) {
      throw new NotFoundException('You have not liked this comment.');
    }

    comment.likes.splice(index, 1);

    await this.postRepository.update(request.postId, post);
  }
}
