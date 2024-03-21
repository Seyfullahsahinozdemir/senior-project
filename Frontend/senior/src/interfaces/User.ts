export type User = {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  preferences: {
    gender?: string;
    phone?: string;
    address?: string;
    about?: string;
    image?: { filename?: string; mimetype?: string };
  };
};
