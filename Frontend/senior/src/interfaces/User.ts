export type User = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  preferences: {
    gender?: string;
    phone?: string;
    address?: string;
    about?: string;
    image?: { filename?: string; mimetype?: string };
  };
  following?: [
    {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    }
  ];
  followers?: [
    {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
    }
  ];
  followerCount?: number;
  followingCount?: number;
  isFollow?: boolean;
};
