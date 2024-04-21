import { AuditableEntity } from './common/auditable.entity';

export class Item extends AuditableEntity {
  urlName: string;
  description: string | null;
  title: string | null;
  topCategory: string;
  subCategories: string[] | null;
  image: { fileId?: string; filename?: string; mimetype: string; public?: boolean };

  constructor(
    urlName: string,
    description: string | null,
    title: string | null,
    topCategory: string,
    subCategories: string[] | null,
    image: { fileId?: string; filename?: string; mimetype: string; public?: boolean },
  ) {
    super();
    this.urlName = urlName;
    this.description = description;
    this.title = title;
    this.topCategory = topCategory;
    this.subCategories = subCategories;
    this.image = image;
  }
}
