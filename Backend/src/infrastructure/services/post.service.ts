import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { CommentPostDTO } from '@application/dto/post/comment.post';
import { DeleteCommentPostDTO } from '@application/dto/post/delete.comment.post';
import { LikeCommentPostDTO } from '@application/dto/post/like.comment.post';
import { RequestPostDTO } from '@application/dto/post/request.post';
import { NotFoundException, ValidationException } from '@application/exceptions';
import { IAuthService, IPostService, IUserService } from '@application/interfaces';
import { IItemRepository, IPostRepository } from '@application/persistence';
import { Post } from '@domain/entities';
import { Comment } from '@domain/entities/comment';
import { ObjectId } from 'mongodb';

export class PostService implements IPostService {
  public readonly postRepository: IPostRepository;
  public readonly userService: IUserService;
  public readonly itemRepository: IItemRepository;
  private readonly authService: IAuthService;

  constructor({
    postRepository,
    userService,
    itemRepository,
    authService,
  }: {
    postRepository: IPostRepository;
    userService: IUserService;
    itemRepository: IItemRepository;
    authService: IAuthService;
  }) {
    this.postRepository = postRepository;
    this.userService = userService;
    this.itemRepository = itemRepository;
    this.authService = authService;
  }

  async getPostsByItemId(request: PaginatedRequest, itemId: string): Promise<Post[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const posts = await this.postRepository.find({ items: { $in: [itemId] } }, pageIndex, pageSize, {
      createdAt: -1,
    });

    return posts;
  }

  async getComments(request: PaginatedRequest, postId: string): Promise<Comment[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const post = await this.postRepository.findOne(postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const pipeline = [
      { $match: { _id: new ObjectId(postId) } },
      { $project: { comments: 1 } },
      { $unwind: '$comments' },
      { $sort: { 'comments.createdAt': -1 } },
      { $skip: pageIndex * pageSize },
      { $limit: pageSize },
      { $replaceRoot: { newRoot: '$comments' } },
    ];

    const paginatedComments = await this.postRepository.aggregate(pipeline);

    return paginatedComments;
  }

  async getPostsByCurrentUser(request: PaginatedRequest): Promise<Post[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const posts = await this.postRepository.find({ createdBy: this.authService.currentUserId }, pageIndex, pageSize, {
      createdAt: -1,
    });

    return posts;
  }

  async getPostsByUserId(request: PaginatedRequest, userId: string): Promise<Post[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const posts = await this.postRepository.find({ createdBy: userId }, pageIndex, pageSize, {
      createdAt: -1,
    });

    return posts;
  }

  async getPosts(request: PaginatedRequest): Promise<Post[]> {
    const pageIndex = request.pageIndex ? parseInt(request.pageIndex) : 0;
    const pageSize = request.pageSize ? parseInt(request.pageSize) : 10;

    const followingList = await this.userService.getFollowing();
    const followingUserIds = followingList.map((user) => user._id);

    const posts = await this.postRepository.find({ createdBy: { $in: followingUserIds } }, pageIndex, pageSize, {
      createdAt: -1,
    });

    return posts;
  }

  async getPostById(postId: string): Promise<Post> {
    const post = await this.postRepository.findOne(postId);

    return post;
  }

  async createPost(request: RequestPostDTO): Promise<Post> {
    const post = new Post(request.content, request.items);
    post.createEntity(this.authService.currentUserId as string);

    return await this.postRepository.create(post);
  }

  async deletePost(_id: string): Promise<void> {
    const deletedPost = await this.postRepository.delete(_id);
    if (!deletedPost) {
      throw new NotFoundException('Post not found');
    }
  }

  async likePost(_id: string): Promise<void> {
    const post = await this.postRepository.findOne(_id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.likes?.includes(this.authService.currentUserId as string)) {
      throw new ValidationException('You cannot like your posts or cannot like again.');
    }
    post.likes?.push(this.authService.currentUserId as string);
    await this.postRepository.update(_id, post);
  }

  async unlikePost(_id: string): Promise<void> {
    const post = await this.postRepository.findOne(_id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (!post.likes?.includes(this.authService.currentUserId as string)) {
      throw new ValidationException('No user post-like relation found.');
    }
    post.likes = post.likes?.filter((userId) => userId !== (this.authService.currentUserId as string));
    await this.postRepository.update(_id, post);
  }

  async createComment(request: CommentPostDTO): Promise<Post> {
    const post = await this.postRepository.findOne(request.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    const comment = new Comment(request.content, this.authService.currentUserId as string);
    comment._id = new ObjectId();
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

    if (post.comments[index].createdBy != (this.authService.currentUserId as string)) {
      throw new ValidationException('You cannot remove a comment that not belongs to you.');
    }

    post.comments.splice(index, 1);
    await this.postRepository.update(post._id?.toString() as string, post);
  }

  async likeComment(request: LikeCommentPostDTO): Promise<void> {
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
    if (
      comment.likes.includes(this.authService.currentUserId as string) ||
      comment.createdBy == (this.authService.currentUserId as string)
    ) {
      throw new ValidationException('You cannot like a comment more than one or cannot like your comment.');
    }
    comment.likes.push(this.authService.currentUserId as string);
    await this.postRepository.update(request.postId, post);
  }

  async unlikeComment(request: LikeCommentPostDTO): Promise<void> {
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

    const index = comment.likes.indexOf(this.authService.currentUserId as string);
    if (index === -1) {
      throw new NotFoundException('You have not liked this comment.');
    }

    comment.likes.splice(index, 1);

    await this.postRepository.update(request.postId, post);
  }
}
