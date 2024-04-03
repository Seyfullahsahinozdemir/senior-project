import { Dependencies } from '@infrastructure/di';
import { makeRegisterCommand } from './commands/auth/register/register.command';
import { makeLoginCommand } from './commands/auth/login/login.command';
import { makeVerifyForLoginCommand } from './commands/auth/verify-login/verify.command';
import { makeResetPasswordCommand } from './commands/auth/reset-password';
import { makeVerifyForResetPasswordCommand } from './commands/auth/verify-reset-password';
import { makeGetProfileCommand } from './queries/auth/get-profile';
import { makeGetUsersCommand } from './queries/user/list-users';
import { makeGetFollowersCommand } from './queries/user/get-followers';
import { makeGetFollowingCommand } from './queries/user/get-following';
import { makeFollowCommand } from './commands/user/follow';
import { makeUnFollowCommand } from './commands/user/unFollow';
import { makeUpdateCommand } from './commands/category/update';
import { makeCreateCommand as createCategoryCommand } from './commands/category/create';
import { makeDeleteCommand as deleteCategoryCommand } from './commands/category/delete';
import { makeCreateCommand as createItemCommand } from './commands/item/create';
import { makeGetItemsByCurrentUserCommand as getItemsCommand } from './queries/item/get';
import { makeDeleteCommand as deleteItemCommand } from './commands/item/delete';
import { makeGetCategoriesCommand as getCategoriesCommand } from './queries/category/get';
import { makeCreatePostCommand } from './commands/post/create';
import { makeDeletePostCommand } from './commands/post/delete';
import { makeLikePostCommand } from './commands/post/like';
import { makeUnlikePostCommand } from './commands/post/unlike';
import { makeGetPostsCommand } from './queries/post/get';
import { makeCreateCommentCommand } from './commands/comment/create';
import { makeDeleteCommentCommand } from './commands/comment/delete';
import { makeLikeCommentCommand } from './commands/comment/like';
import { makeUnlikeCommentCommand } from './commands/comment/unlike';
import { makeGetCommentsCommand } from './queries/comment/get';
import { makeGetCommand } from './queries/search/get/get.command';
import { makeUpdateCommand as updateUserCommand } from './commands/user/update';
import { makeGetUsersByUsernameCommand } from './queries/user/list-users-by-username';
import { makeUploadCommand } from './commands/image/upload';
import { makeGetPostsByUserIdCommand } from './queries/post/get-by-user-id';
import { makeGetPostsByCurrentUserCommand } from './queries/post/get-by-current-user';
import { makeGetUserProfileByUserCommand } from './queries/user/get-user-profile-by-user';
import { makeGetItemsByUserIdCommand } from './queries/item/get-items-by-user-id';
import { makeGetPostByIdCommand } from './queries/post/get-by-id';
import { makeAddFavoriteItemCommand } from './commands/user/add-favorite-item';
import { makeDeleteFavoriteItemCommand } from './commands/user/delete-favorite-item';
import { makeGetFavoriteItemsByCurrentUserCommand } from './queries/user/get-favorite-items-by-current-user';
import { makeGetFavoriteItemsByUserIdCommand } from './queries/user/get-favorite-items-by-user-id';

export function makeAuth(dependencies: Dependencies) {
  return {
    commands: {
      register: makeRegisterCommand(dependencies),
      login: makeLoginCommand(dependencies),
      verifyLogin: makeVerifyForLoginCommand(dependencies),
      resetPassword: makeResetPasswordCommand(dependencies),
      verifyResetPassword: makeVerifyForResetPasswordCommand(dependencies),
    },
    queries: {
      getProfile: makeGetProfileCommand(dependencies),
    },
  };
}

export function makeUser(dependencies: Dependencies) {
  return {
    commands: {
      follow: makeFollowCommand(dependencies),
      unFollow: makeUnFollowCommand(dependencies),
      update: updateUserCommand(dependencies),
      addFavoriteItem: makeAddFavoriteItemCommand(dependencies),
      deleteFavoriteItem: makeDeleteFavoriteItemCommand(dependencies),
    },
    queries: {
      getUsers: makeGetUsersCommand(dependencies),
      getUsersByUsername: makeGetUsersByUsernameCommand(dependencies),
      getFollowers: makeGetFollowersCommand(dependencies),
      getFollowing: makeGetFollowingCommand(dependencies),
      getUserProfileByUser: makeGetUserProfileByUserCommand(dependencies),
      getFavoriteItemsByCurrentUser: makeGetFavoriteItemsByCurrentUserCommand(dependencies),
      getFavoriteItemsByUserId: makeGetFavoriteItemsByUserIdCommand(dependencies),
    },
  };
}

export function makeCategory(dependencies: Dependencies) {
  return {
    commands: {
      create: createCategoryCommand(dependencies),
      update: makeUpdateCommand(dependencies),
      delete: deleteCategoryCommand(dependencies),
    },
    queries: {
      get: getCategoriesCommand(dependencies),
    },
  };
}

export function makeItem(dependencies: Dependencies) {
  return {
    commands: {
      create: createItemCommand(dependencies),
      delete: deleteItemCommand(dependencies),
    },
    queries: {
      get: getItemsCommand(dependencies),
      getItemsByUserId: makeGetItemsByUserIdCommand(dependencies),
    },
  };
}

export function makePost(dependencies: Dependencies) {
  return {
    commands: {
      create: makeCreatePostCommand(dependencies),
      delete: makeDeletePostCommand(dependencies),
      like: makeLikePostCommand(dependencies),
      unlike: makeUnlikePostCommand(dependencies),
    },
    queries: {
      get: makeGetPostsCommand(dependencies),
      getPostById: makeGetPostByIdCommand(dependencies),
      getPostByUserId: makeGetPostsByUserIdCommand(dependencies),
      getPostByCurrentUser: makeGetPostsByCurrentUserCommand(dependencies),
    },
  };
}

export function makeComment(dependencies: Dependencies) {
  return {
    commands: {
      create: makeCreateCommentCommand(dependencies),
      delete: makeDeleteCommentCommand(dependencies),
      like: makeLikeCommentCommand(dependencies),
      unlike: makeUnlikeCommentCommand(dependencies),
    },
    queries: {
      get: makeGetCommentsCommand(dependencies),
    },
  };
}

export function makeSearch(dependencies: Dependencies) {
  return {
    commands: {},
    queries: {
      get: makeGetCommand(dependencies),
    },
  };
}

export function makeImage(dependencies: Dependencies) {
  return {
    commands: {
      upload: makeUploadCommand(dependencies),
    },
    queries: {},
  };
}
