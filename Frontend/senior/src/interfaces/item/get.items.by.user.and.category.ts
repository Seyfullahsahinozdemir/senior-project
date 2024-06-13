export type GetItemsByCurrentUserAndCategory = {
  _id: string;
  title?: string;
  urlName?: string;
  description?: string;
  image: { filename?: string; mimetype?: string; fileId?: string };
};
