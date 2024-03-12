import { AuditableEntity } from './common/auditable.entity';

export class Item extends AuditableEntity {
  urlName: string;
  description: string | null;
  title: string | null;
  topCategory: string;
  subCategories: string[] | null;
  image: { filename: string; mimetype: string };

  constructor(
    urlName: string,
    description: string | null,
    title: string | null,
    topCategory: string,
    subCategories: string[] | null,
    image: { filename: string; mimetype: string },
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
