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
    const currentDate = new Date();
    this.createdAt = currentDate;
    this.updatedAt = currentDate;
  }

  create(userId: string): AuditableEntity {
    this.createdBy = userId;
    this.updatedBy = userId;
    return this;
  }

  update(userId: string): AuditableEntity {
    const currentDate = new Date();
    this.updatedAt = currentDate;
    this.updatedBy = userId;
    return this;
  }

  delete(userId: string): AuditableEntity {
    const currentDate = new Date();
    this.deletedAt = currentDate;
    this.deletedBy = userId;
    return this;
  }
}
