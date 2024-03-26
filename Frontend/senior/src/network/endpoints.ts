export const baseURLForDev = "http://localhost:3000/api/v1";
export const baseURLForProd = "";

// auth
export const registerEndpoint = "/auth/register";
export const loginEndpoint = "/auth/login";
export const loginVerifyEndpoint = "/auth/verify-login";
export const resetPasswordEndpoint = "/auth/reset-password";
export const verifyResetPasswordEndPoint = "/auth/verify-reset-password";
export const getProfileEndPoint = "/auth/get-profile";

// user
export const getFollowingEndpoint = "/user/get-following";
export const getUsersByUsernameEndpoint = "/user/get-users-by-username";
export const updateUserEndPoint = "/user/update";

// post
export const getPosts = "/post/get";
export const getPostsByUserId = "/post/get-posts-by-user-id";

// item
export const getItems = "/item/get";

// image
export const uploadImageEndPoint = "/image/upload";

export const getProdUrl = (url: string) => baseURLForProd + url;

export const getDevUrl = (url: string) => baseURLForDev + url;
