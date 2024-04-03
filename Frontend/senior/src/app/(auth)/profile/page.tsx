"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import NetworkManager from "@/network/network.manager";
import {
  getDevUrl,
  getProfileEndPoint,
  resetPasswordEndpoint,
  getPostsByCurrentUser,
  getItemsByCurrentUser,
  deletePost,
  deleteItemEndPoint,
  getFavoriteItemsByCurrentUserEndPoint,
} from "@/network/endpoints";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { useRouter } from "next/navigation";
import { AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useFormattedDate from "@/helpers/useFormattedDate.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { User } from "@/interfaces/User";
import EditProfileModal from "@/components/modal/edit.profile.modal";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import PostCardComponent from "@/components/post/post.card";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import ItemCardComponent from "@/components/item/item.card";
import AddItemModal from "@/components/modal/add.item.modal";

const MyProfilePage = () => {
  const [user, setUser] = useState<User>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const [showEditModal, setEditShowModal] = useState(false);
  const [showAddItemModal, setAddItemShowModal] = useState(false);

  const router = useRouter();
  const { formatDate } = useFormattedDate();
  const { handleErrorResponse } = useErrorHandling();
  const [posts, setPosts] = useState<GetPostsByUserIdType[]>([]);
  const [items, setItems] = useState<GetItemsByCurrentUser[]>([]);
  const [page, setPage] = useState(0);
  const [selectedButton, setSelectedButton] = useState<string>("posts");
  const [favoriteChecked, setFavoriteChecked] = useState(false);

  const handleFavoriteChange = () => {
    setFavoriteChecked(!favoriteChecked);
  };

  useEffect(() => {
    if (!showEditModal) {
      networkManager
        .post(getDevUrl(getProfileEndPoint), {})
        .then((response) => {
          if (response.success) {
            setUser(response.data.user);
          }
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    }

    if (selectedButton == "posts") {
      loadPosts();
    } else {
      if (selectedButton == "items" && favoriteChecked) {
        loadFavorites();
      } else if (selectedButton == "items" && !favoriteChecked) {
        loadItems();
      }
    }
  }, [showEditModal, showAddItemModal, favoriteChecked]);

  const loadMorePosts = () => {
    networkManager
      .post(getDevUrl(getPostsByCurrentUser), { pageIndex: page, pageSize: 5 })
      .then((response: ICustomResponse) => {
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setPage(page + 1);
      });
  };

  const loadMoreItems = () => {
    if (favoriteChecked) {
      networkManager
        .post(getDevUrl(getFavoriteItemsByCurrentUserEndPoint), {
          pageIndex: page,
          pageSize: 5,
        })
        .then((response: ICustomResponse) => {
          console.log(response);
          setItems((prevItems) => [...prevItems, ...response.data]);
          setPage(page + 1);
        });
    } else {
      networkManager
        .post(getDevUrl(getItemsByCurrentUser), {
          pageIndex: page,
          pageSize: 5,
        })
        .then((response: ICustomResponse) => {
          console.log(response);
          setItems((prevItems) => [...prevItems, ...response.data]);
          setPage(page + 1);
        });
    }
  };

  const loadItems = () => {
    setSelectedButton("items");
    setPosts([]);
    networkManager
      .post(getDevUrl(getItemsByCurrentUser), { pageIndex: 0, pageSize: 5 })
      .then((response: ICustomResponse) => {
        setItems(response.data);
        setPage(1);
      });
  };

  const loadFavorites = () => {
    setSelectedButton("items");
    setPosts([]);
    networkManager
      .post(getDevUrl(getFavoriteItemsByCurrentUserEndPoint), {
        pageIndex: 0,
        pageSize: 5,
      })
      .then((response: ICustomResponse) => {
        console.log(response.data);
        setItems(response.data);
        setPage(1);
      });
  };

  const loadPosts = () => {
    setSelectedButton("posts");
    setItems([]);
    networkManager
      .post(getDevUrl(getPostsByCurrentUser), {
        pageIndex: 0,
        pageSize: 5,
      })
      .then((response: ICustomResponse) => {
        console.log("post page: ", page);
        setPosts(response.data);
        setPage(1);
      });
  };

  const handleResetPasswordClick = async () => {
    try {
      const response = await networkManager.post(
        getDevUrl(resetPasswordEndpoint),
        {}
      );

      if (response.success) {
        toast.success("Check your email for otp code");
        setTimeout(() => {
          router.push("/profile/verify");
        }, 1200);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePost = async (post: GetPostsByUserIdType) => {
    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(deletePost),
        { postId: post._id }
      );

      if (response.success) {
        toast.success(response.message);
        loadPosts();
      } else {
        toast.error(`Error: ${response.data.errors}`);
        return;
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleRemoveItem = async (item: GetItemsByCurrentUser) => {
    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(deleteItemEndPoint),
        { _id: item._id }
      );

      if (response.success) {
        toast.success(response.message);
        loadPosts();
      } else {
        toast.error(`Error: ${response.data.errors}`);
        return;
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleAddNewPost = () => {
    console.log("Post eklendi");
  };

  return (
    <div>
      {user && (
        <EditProfileModal
          show={showEditModal}
          setShow={setEditShowModal}
          info={user}
          onUpdateUser={(updatedUser: User) => {
            setUser(updatedUser);
          }}
        />
      )}
      {
        <AddItemModal
          show={showAddItemModal}
          setShow={setAddItemShowModal}
          onAddItem={() => {
            loadItems();
          }}
        />
      }
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
                <AiOutlineEdit
                  data-modal-target="edit-profile-modal"
                  data-modal-toggle="edit-profile-modal"
                  className="w-5 h-5 hover:text-blue-300 cursor-pointer"
                  onClick={() => setEditShowModal(true)}
                />
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
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Password</div>
                    <button
                      type="button"
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-2/3 ml-3"
                      onClick={handleResetPasswordClick}
                    >
                      Reset Password
                    </button>
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

              <div className="flex items-center flex-wrap gap-3 pt-4">
                {selectedButton === "posts" ? (
                  <button
                    type="button"
                    className="text-gray-900 border border-blue-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10 bg-white hover:bg-gray-100 ring-gray-200"
                    onClick={handleAddNewPost}
                  >
                    Add New Post
                  </button>
                ) : (
                  selectedButton === "items" && (
                    <>
                      <div className="flex gap-3 items-center w-full">
                        {" "}
                        <button
                          type="button"
                          className="text-gray-900 border border-blue-300 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10 bg-white hover:bg-gray-100 ring-gray-200"
                          onClick={() => setAddItemShowModal(true)}
                        >
                          Add New Item
                        </button>
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
                      </div>
                    </>
                  )
                )}
              </div>

              {selectedButton === "posts" ? (
                <>
                  <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
                    {posts?.map((post) => (
                      <PostCardComponent
                        key={post._id}
                        post={post}
                        handleRemovePost={handleRemovePost}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-6 py-2"
                      onClick={loadMorePosts}
                    >
                      Load More
                    </button>
                  </div>
                </>
              ) : (
                selectedButton === "items" && (
                  <>
                    <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
                      {items.map((item, index) => (
                        <ItemCardComponent
                          key={index}
                          item={item}
                          handleRemoveItem={handleRemoveItem}
                        />
                      ))}
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

export default MyProfilePage;
