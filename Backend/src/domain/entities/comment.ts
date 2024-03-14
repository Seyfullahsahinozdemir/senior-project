import { BaseEntity } from './common/base.entity';

export class Comment extends BaseEntity {
  createdBy: string;
  createdAt: Date;
  likes: string[];
  content: string;

  constructor(content: string, currentUserId: string) {
    super();
    this.content = content;
    this.likes = [];
    this.createdAt = new Date();
    this.createdBy = currentUserId;
  }
}
