import { Comment } from './comment';
import { AuditableEntity } from './common/auditable.entity';

export class Post extends AuditableEntity {
  content: string;
  items: string[];
  likes?: string[];
  comments?: Comment[];

  constructor(content: string, items: string[]) {
    super();
    this.content = content;
    this.items = items;
    this.likes = [];
    this.comments = [];
  }
}
