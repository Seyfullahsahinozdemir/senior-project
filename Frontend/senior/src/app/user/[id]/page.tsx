"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import NetworkManager from "@/network/network.manager";
import {
  followUserEndPoint,
  getDevUrl,
  getFavoriteItemsByUserIdEndPoint,
  getItemsByUserId,
  getPostsByUserId,
  getUserProfileByUserEndPoint,
  unFollowUserEndPoint,
} from "@/network/endpoints";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import "react-toastify/dist/ReactToastify.css";
import { usePathname } from "next/navigation";

import useFormattedDate from "@/helpers/useFormattedDate.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { User } from "@/interfaces/User";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";

import SimplePostCardComponent from "@/components/post/simple.post.card.component";
import SimpleItemCardComponent from "@/components/item/simple.item.card";
import LoadMoreButton from "@/components/common/load.button";
import { toast } from "react-toastify";

const UserProfilePage = () => {
  const [user, setUser] = useState<User>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { formatDate } = useFormattedDate();
  const { handleErrorResponse } = useErrorHandling();
  const [posts, setPosts] = useState<GetPostsByUserIdType[]>([]);
  const [items, setItems] = useState<GetItemsByCurrentUser[]>([]);
  const [page, setPage] = useState(0);
  const [selectedButton, setSelectedButton] = useState<string>("posts");
  const [favoriteChecked, setFavoriteChecked] = useState(false);
  const [followState, setFollowState] = useState(false);

  const pathname = usePathname();
  const userId = pathname.split("/").pop();

  useEffect(() => {
    networkManager
      .post(getDevUrl(getUserProfileByUserEndPoint), { _id: userId })
      .then((response) => {
        if (response.success) {
          setUser(response.data.user);
          setFollowState(response.data.user.isFollow);
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
    if (selectedButton == "posts") {
      loadPosts();
    } else {
      if (selectedButton == "items" && favoriteChecked) {
        loadFavorites();
      } else if (selectedButton == "items" && !favoriteChecked) {
        loadItems();
      }
    }
  }, [favoriteChecked]);

  const loadMorePosts = () => {
    networkManager
      .post(getDevUrl(getPostsByUserId), {
        pageIndex: page,
        pageSize: 5,
        userId: userId,
      })
      .then((response: ICustomResponse) => {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setPage(page + 1);
      });
  };

  const loadMoreItems = () => {
    if (favoriteChecked) {
      networkManager
        .post(getDevUrl(getFavoriteItemsByUserIdEndPoint), {
          pageIndex: page,
          pageSize: 5,
          userId,
        })
        .then((response: ICustomResponse) => {
          console.log(response);
          setItems((prevItems) => [...prevItems, ...response.data]);
          setPage(page + 1);
        });
    } else {
      networkManager
        .post(getDevUrl(getItemsByUserId), {
          pageIndex: page,
          pageSize: 5,
          userId: userId,
        })
        .then((response: ICustomResponse) => {
          setItems((prevItems) => [...prevItems, ...response.data]);
          setPage(page + 1);
        });
    }
  };

  const loadItems = () => {
    setSelectedButton("items");
    setPosts([]);
    networkManager
      .post(getDevUrl(getItemsByUserId), {
        pageIndex: 0,
        pageSize: 5,
        userId: userId,
      })
      .then((response: ICustomResponse) => {
        setItems(response.data);
        setPage(1);
      });
  };

  const loadPosts = () => {
    setSelectedButton("posts");
    setItems([]);
    networkManager
      .post(getDevUrl(getPostsByUserId), {
        pageIndex: 0,
        pageSize: 5,
        userId: userId,
      })
      .then((response: ICustomResponse) => {
        setPosts(response.data);
        setPage(1);
      });
  };

  const loadFavorites = () => {
    setSelectedButton("items");
    setPosts([]);
    networkManager
      .post(getDevUrl(getFavoriteItemsByUserIdEndPoint), {
        pageIndex: 0,
        pageSize: 5,
        userId,
      })
      .then((response: ICustomResponse) => {
        console.log(response.data);
        setItems(response.data);
        setPage(1);
      });
  };

  const handleFavoriteChange = () => {
    setFavoriteChecked(!favoriteChecked);
  };

  const handleFollowClick = async () => {
    try {
      if (followState) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(unFollowUserEndPoint),
          {
            targetUserId: user?._id,
          }
        );
        if (response.success) {
          setFollowState(false);
          setUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  followerCount: prevUser.followerCount
                    ? prevUser.followerCount - 1
                    : prevUser.followerCount,
                }
              : undefined
          );
          toast.success(response.message);
        } else {
          toast.error(`Error: ${response.data.errors}`);
        }
      } else {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(followUserEndPoint),
          {
            targetUserId: user?._id,
          }
        );
        if (response.success) {
          setFollowState(true);
          setUser((prevUser) =>
            prevUser
              ? {
                  ...prevUser,
                  followerCount: prevUser.followerCount
                    ? prevUser.followerCount + 1
                    : prevUser.followerCount,
                }
              : undefined
          );
          toast.success(response.message);
        } else {
          toast.error(`Error: ${response.data.errors}`);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      handleErrorResponse(error);
    }
  };

  return (
    <div>
      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-blue-400">
              <div className="image overflow-hidden">
                <Image
                  className="h-auto mx-auto"
                  width={200}
                  height={200}
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user?.preferences.image?.filename}`}
                  alt="profile image"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {user?.firstName} {user?.lastName}
              </h1>
              <h3 className="text-gray-600 font-lg text-semibold leading-6">
                {user?.email}
              </h3>
              <p className="text-sm text-gray-500 hover:text-gray-600 leading-6">
                {user?.preferences?.about}
              </p>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">{formatDate(user?.createdAt)}</span>
                </li>
                <li className="flex items-center py-3">
                  <span>Followers</span>
                  <span className="ml-auto">{user?.followerCount}</span>
                </li>
                <li className="flex items-center py-3">
                  <span>Following</span>
                  <span className="ml-auto">{user?.followingCount}</span>
                </li>
                <li className="flex items-center py-3">
                  <span>Followed</span>
                  <button
                    onClick={handleFollowClick}
                    className="ml-auto mt-3 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {followState ? "Unfollow" : "Follow"}
                  </button>
                </li>
              </ul>
            </div>
            <div className="my-4"></div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-blue-500">
                  <svg
                    className="h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
                <div className="flex-grow" />
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">First Name</div>
                    <div className="px-4 py-2">{user?.firstName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Last Name</div>
                    <div className="px-4 py-2">{user?.lastName}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Gender</div>
                    <div className="px-4 py-2">{user?.preferences?.gender}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Contact No</div>
                    <div className="px-4 py-2">{user?.preferences?.phone}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">
                      Current Address
                    </div>
                    <div className="px-4 py-2">
                      {user?.preferences?.address}
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">
                      <a
                        className="text-blue-800"
                        href="mailto:jane@example.com"
                      >
                        {user?.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-sm">
              <div className="flex items-center justify-center flex-wrap gap-3">
                <button
                  type="button"
                  className={`text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10 ${
                    selectedButton === "posts"
                      ? "bg-gray-200 ring-gray-400"
                      : "bg-white hover:bg-gray-100 ring-gray-200"
                  }`}
                  onClick={() => loadPosts()}
                  disabled={selectedButton === "posts"}
                >
                  Posts
                </button>
                <button
                  type="button"
                  className={`text-gray-900 border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10 ${
                    selectedButton === "items"
                      ? "bg-gray-200 ring-gray-400"
                      : "bg-white hover:bg-gray-100 ring-gray-200"
                  }`}
                  onClick={() => loadItems()}
                  disabled={selectedButton === "items"}
                >
                  Items
                </button>
              </div>

              {selectedButton === "posts" ? (
                <>
                  <div className="grid grid-cols-1 gap-3 pt-4 w-11/12">
                    {posts?.map((post) => (
                      <SimplePostCardComponent key={post._id} post={post} />
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <LoadMoreButton onClick={loadMorePosts} />
                  </div>
                </>
              ) : (
                selectedButton === "items" && (
                  <>
                    <div className="items-center w-7/8">
                      <div className="flex gap-3 items-center px-4 py-2 pl-4 bg-white rounded-md shadow-md hover:shadow-lg transition duration-300 w-full">
                        <div className="text-lg font-semibold">
                          Choose tags:
                        </div>
                        <ul className="flex justify-center space-x-2">
                          <li className="relative">
                            <button
                              className={`px-4 py-2 rounded-full ${
                                favoriteChecked
                                  ? "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-sky-500 ring-2 ring-sky-500"
                                  : "bg-white text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 ring-2 ring-transparent"
                              }`}
                              onClick={handleFavoriteChange}
                            >
                              Favorite
                            </button>
                            {favoriteChecked && (
                              <span className="absolute top-0 right-0 block w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white"></span>
                            )}
                          </li>
                        </ul>
                      </div>
                      <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
                        {items.map((item, index) => (
                          <SimpleItemCardComponent key={index} item={item} />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center mt-4">
                      <button
                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-6 py-2"
                        onClick={loadMoreItems}
                      >
                        Load More
                      </button>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
