import { IAuditableEntity } from './IAuditableEntity';
import { ISoftDelete } from './ISoftDelete';
import { BaseEntity } from './base.entity';

export abstract class AuditableEntity extends BaseEntity implements IAuditableEntity, ISoftDelete {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;

  deletedAt?: Date;
  deletedBy?: string;

  constructor() {
    super();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  create(userId: string): AuditableEntity {
    this.createdBy = userId;
    this.updatedBy = userId;
    return this;
  }

  update(userId: string): AuditableEntity {
    this.updatedAt = new Date();
    this.updatedBy = userId;
    return this;
  }

  delete(userId: string): AuditableEntity {
    this.deletedAt = new Date();
    this.deletedBy = userId;
    return this;
  }
}
