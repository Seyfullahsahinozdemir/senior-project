export type Item = {
  _id: string;
  urlName?: string;
  description?: string | null;
  title?: string | null;
  topCategory?: string;
  subCategories?: string[] | null;
  image?: { filename?: string; mimetype?: string };
};
