export const baseURLForDev = "http://localhost:3000/api/v1";
export const baseURLForProd = "";

// auth
export const registerEndpoint = "/auth/register";
export const loginEndpoint = "/auth/login";
export const loginVerifyEndpoint = "/auth/verify-login";

// user
export const getFollowingEndpoint = "/user/get-following";
export const getUsersByUsernameEndpoint = "/user/get-users-by-username";

// post
export const getPosts = "/post/get";

// item
export const getItems = "/item/get";

export const getProdUrl = (url: string) => baseURLForProd + url;

export const getDevUrl = (url: string) => baseURLForDev + url;
