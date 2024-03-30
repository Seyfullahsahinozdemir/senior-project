export type Item = {
  _id: string;
  urlName: string;
  description?: string;
  title?: string;
  topCategory: string;
  subCategories?: string[];
  image: { filename?: string; mimetype?: string; fileId?: string };
  createdAt: string;
  createdBy: string;
};
