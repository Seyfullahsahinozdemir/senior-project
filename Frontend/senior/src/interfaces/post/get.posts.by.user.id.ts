export type GetPostsByUserIdType = {
  _id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    image: { filename: string; mimetype: string };
  };
  items: [{ image: { filename: string } }];
  comments: any[];
  liked: boolean;
};
