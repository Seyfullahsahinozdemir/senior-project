import { User } from "./User";

export type Comment = {
  _id: string;
  createdBy: User;
  createdAt: string;
  likes: string[];
  content: string;
  likeCount: number;
  liked: boolean;
  me: boolean;
};
