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
import UserListItem from "@/components/user/user.list.item";
import FollowingList from "@/components/user/following.list";
import PostCardComponent from "@/components/post/post.card";
import { GetPostsByUserIdType } from "@/interfaces/post/get.posts.by.user.id";
import { useRouter } from "next/navigation";
import NarrowUserListItem from "@/components/user/narrow.user.list.item";
import NarrowFollowingListComponent from "@/components/user/narrow.following.list";

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [windowWidth, setWindowWidth] = useState(0);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [searchUserList, setSearchUserList] = useState<User[] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [posts, setPosts] = useState<GetPostsByUserIdType[]>([]);
  const router = useRouter();

  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
      return;
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

  const handleSearchSelectedUser = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const handleSearchBoxBlur = () => {
    setSearchUserList([]);
  };

  return (
    <>
      {windowWidth > 768 ? (
        <>
          <div className="flex">
            <div className="w-full p-4">
              <div className="mb-4 flex justify-center items-center">
                <div className="bg-gray-200 p-4 w-96">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    onBlur={handleSearchBoxBlur}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <div className="overflow-y-auto max-h-60">
                    <ul className="flex justify-center flex-col">
                      {searchUserList?.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleSearchSelectedUser(user._id)}
                        >
                          <UserListItem user={user} />
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(100vh - 4rem - 1rem)" }}
              >
                {posts.map((post) => (
                  <PostCardComponent key={post._id} post={post} />
                ))}
              </div>
            </div>
            <div
              className="bg-gray-300 mt-4 mr-2"
              style={{ maxHeight: "calc(100vh - 4rem - 1rem)" }}
            >
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
              <div className="bg-gray-200 p-4 w-1/3 min-w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <div className="overflow-y-auto max-h-60">
                  <ul className="flex justify-center flex-col">
                    {searchUserList?.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSearchSelectedUser(user._id)}
                      >
                        <NarrowUserListItem user={user} />
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-400 h-full w-full">
              <div className="bg-gray-300 mt-4 mr-2 h-full w-full xl:w-3/4">
                <div className="bg-gray-200 p-4 overflow-x-auto overflow-y-hidden">
                  <p>Following List</p>
                  <div className="flex">
                    <NarrowFollowingListComponent
                      followingList={followingList}
                      onUserSelect={handleSelectedUserChange}
                      selectedUser={selectedUser}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-200 p-4 h-full">
                {posts.map((post) => (
                  <PostCardComponent key={post._id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
