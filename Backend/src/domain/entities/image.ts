import { BaseEntity } from './common/base.entity';

export class Image extends BaseEntity {
  filename: string;
  fileId: string;
  path: string;
  mimetype: string;

  constructor(filename: string, path: string, mimetype: string, fileId: string) {
    super();
    this.filename = filename;
    this.path = path;
    this.mimetype = mimetype;
    this.fileId = fileId;
  }
}
