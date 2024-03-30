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
export const getUserProfileByUserEndPoint = "/user/get-user-profile-by-user";

// post
export const getPosts = "/post/get";
export const getPostsByUserId = "/post/get-posts-by-user-id";
export const getPostsByCurrentUser = "/post/get-posts-by-current-user";
export const deletePost = "/post/delete";
export const likePostEndPoint = "/post/like";
export const unLikePostEndPoint = "/post/unlike";

// item
export const getItemsByCurrentUser = "/item/get-items-by-current-user";
export const getItemsByUserId = "/item/get-items-by-user-id";
export const deleteItemEndPoint = "/item/delete";
export const createItemEndPoint = "/item/create";

// image
export const uploadImageEndPoint = "/image/upload";

// category
export const getCategoriesEndPoint = "/category/get";

export const getProdUrl = (url: string) => baseURLForProd + url;

export const getDevUrl = (url: string) => baseURLForDev + url;
