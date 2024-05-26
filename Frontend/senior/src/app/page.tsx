"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { selectIsAuthenticated } from "@/slices/auth.slice";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import NetworkManager from "@/network/network.manager";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import {
  getDevUrl,
  getFollowingEndpoint,
  getUsersByUsernameEndpoint,
  getPostsByUserId,
  getPosts,
} from "@/network/endpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/interfaces/User";
import FollowingList from "@/components/user/following.list";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import NarrowUserListItem from "@/components/user/simple.user.list.item";
import NarrowFollowingListComponent from "@/components/user/simple.following.list";
import SimplePostCardComponent from "@/components/post/simple.post.card.component";

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [windowWidth, setWindowWidth] = useState(0);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [searchUserList, setSearchUserList] = useState<User[] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [posts, setPosts] = useState<GetPostsByUserIdType[]>([]);
  const [isSearchBoxFocused, setIsSearchBoxFocused] = useState(false);

  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const fetchFollowingData = async () => {
      try {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(getFollowingEndpoint),
          {}
        );

        const users: User[] = response.data.users;

        if (response.success) {
          setFollowingList(users);
        } else {
          toast.error(`Error: ${response.data.errors}`);
          return;
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    };

    handleResize();
    fetchFollowingData();

    window.addEventListener("resize", handleResize);

    if (selectedUser) {
      const fetchPostData = async () => {
        try {
          const response: ICustomResponse = await networkManager.post(
            getDevUrl(getPostsByUserId),
            { userId: selectedUser }
          );

          const posts: GetPostsByUserIdType[] = response.data;

          if (response.success) {
            setPosts(posts);
          } else {
            toast.error(`Error: ${response.data.errors}`);
            return;
          }
        } catch (error) {
          handleErrorResponse(error);
        }
      };
      fetchPostData();
    } else {
      const fetchPostData = async () => {
        try {
          const response: ICustomResponse = await networkManager.post(
            getDevUrl(getPosts),
            {}
          );

          const posts: GetPostsByUserIdType[] = response.data;

          if (response.success) {
            setPosts(posts);
          } else {
            toast.error(`Error: ${response.data.errors}`);
            return;
          }
        } catch (error) {
          handleErrorResponse(error);
        }
      };
      fetchPostData();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedUser]);

  const handleSearchChange = async (event: any) => {
    setSearchValue(event.target.value);

    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(getUsersByUsernameEndpoint),
        {
          key: event.target.value,
        }
      );

      if (response.success) {
        const users: User[] = response.data.users;
        setSearchUserList(users);
      } else {
        setSearchUserList(null);
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleSelectedUserChange = (userId: string) => {
    setSelectedUser(userId);
  };

  return (
    <>
      {windowWidth > 768 ? (
        <>
          <div className="flex">
            <div className="w-full p-4">
              <div className="mb-4 flex justify-center items-center">
                <div className="p-4 w-96">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    // onBlur={() => setIsSearchBoxFocused(false)}
                    onFocus={() => setIsSearchBoxFocused(true)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <div className="overflow-y-auto max-h-60 mt-2 bg-white rounded-lg shadow-inner">
                    <div className="flex flex-col cursor-pointer">
                      {isSearchBoxFocused &&
                        searchValue &&
                        searchUserList &&
                        searchUserList.length === 0 && (
                          <div className="text-center text-gray-500 py-2">
                            No users found.
                          </div>
                        )}
                      {isSearchBoxFocused &&
                        searchUserList &&
                        searchUserList.map((user) => (
                          <div
                            key={user._id}
                            className="hover:bg-gray-100 rounded-lg p-2"
                          >
                            <NarrowUserListItem user={user} />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 4rem - 1rem)" }}
              >
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <SimplePostCardComponent key={post._id} post={post} />
                  ))
                ) : (
                  <div className="text-center p-4">No Post Found</div>
                )}
              </div>
            </div>
            <div>
              <FollowingList
                followingList={followingList}
                onUserSelect={handleSelectedUserChange}
                selectedUser={selectedUser}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row pt-4">
            <div className="mb-4 flex justify-center items-center">
              <div className="p-4 w-1/3 min-w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchBoxFocused(true)}
                  // onBlur={() => {
                  //   setIsSearchBoxFocused(false);
                  // }}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
                />
                <div className="overflow-y-auto max-h-60 mt-2 bg-white rounded-lg shadow-inner">
                  <div className="flex flex-col cursor-pointer">
                    {isSearchBoxFocused &&
                      searchValue &&
                      searchUserList &&
                      searchUserList.length === 0 && (
                        <div className="text-center text-gray-500 py-2">
                          No Users Found
                        </div>
                      )}
                    {isSearchBoxFocused &&
                      searchUserList &&
                      searchUserList.map((user) => (
                        <div
                          key={user._id}
                          className="hover:bg-gray-100 rounded-lg p-2"
                        >
                          <NarrowUserListItem user={user} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="mt-4 mr-2 w-full xl:w-3/4">
              <div className="p-6 rounded-lg shadow-md overflow-x-auto">
                <p className="text-lg font-semibold mb-4">Following List</p>
                {followingList.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    <NarrowFollowingListComponent
                      followingList={followingList}
                      onUserSelect={handleSelectedUserChange}
                      selectedUser={selectedUser}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500">
                    You can find some users by searching.
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-100 p-4 h-full">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <SimplePostCardComponent key={post._id} post={post} />
                  ))
                ) : (
                  <div className="text-center p-4">No Post Found</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
