import { AuditableEntity } from './common/auditable.entity';

export class Category extends AuditableEntity {
  name: string;
  description?: string | null;

  constructor(name: string, description?: string) {
    super();
    this.name = name;
    this.description = description !== undefined ? description : null;
  }
}
