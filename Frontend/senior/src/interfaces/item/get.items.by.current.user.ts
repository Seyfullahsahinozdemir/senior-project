export type GetItemsByCurrentUser = {
  _id: string;
  urlName: string;
  description?: string;
  title?: string;
  topCategory: string;
  subCategories?: string[];
  image: { filename?: string; mimetype?: string; fileId?: string };
  createdAt: string;
  createdBy: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  me: boolean;
  onFavorite: boolean;
};
