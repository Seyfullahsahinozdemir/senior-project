export type Post = {
  _id: string;
  content?: string;
  createdAt?: string;
  likeCount?: number;
  commentCount?: number;
  user?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    image?: { filename?: string };
  };
  items?: [image?: { filename?: string }];
  comments?: string[];
};
