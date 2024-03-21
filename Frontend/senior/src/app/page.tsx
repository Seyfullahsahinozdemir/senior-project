"use client";
import { useEffect, useState } from "react";
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
  getPosts,
  getItems,
} from "@/network/endpoints";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@/interfaces/User";
import UserListItem from "@/components/user/user.list.item";
import FollowingList from "@/components/user/following.list";
import Image from "next/image";
import { Post } from "@/interfaces/Post";

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [windowWidth, setWindowWidth] = useState(0);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [searchUserList, setSearchUserList] = useState<User[] | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const [posts, setPosts] = useState<Post[]>([]);
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
      return;
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    const fetchData = async () => {
      try {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(getFollowingEndpoint),
          {}
        );
        console.log(response.data);

        const temp: ICustomResponse = await networkManager.post(
          getDevUrl(getPosts),
          {}
        );
        console.log("temp", temp);

        //const users: User[] = response.data.users;

        // mock
        const users: User[] = [];

        for (let i = 0; i < 10; i++) {
          const user: User = {
            _id: `user${i + 1}`,
            username: `user_${i + 1}`,
            email: `user${i + 1}@example.com`,
            firstName: `User${i + 1}`,
            lastName: `Lastname${i + 1}`,
            preferences: {
              image: {
                filename: "1KwMXL7egcHIenYzmvlECZ9pwtbFfNQGQ",
              },
            },
          };
          users.push(user);
        }
        // mock

        setFollowingList(users);
        if (response.success) {
          console.log(response);
        } else {
          toast.error(`Error: ${response.data.errors}`);
          return;
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    };

    handleResize();
    fetchData();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated]);

  const handleSearchChange = async (event: any) => {
    setSearchValue(event.target.value);

    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(getUsersByUsernameEndpoint),
        {
          key: event.target.value,
        }
      );
      const users: User[] = [];

      if (response.success) {
        //const users: User[] = response.data.users;

        // mock

        for (let i = 0; i < 10; i++) {
          const user: User = {
            _id: `user${i + 1}`,
            username: `user_${i + 1}`,
            email: `user${i + 1}@example.com`,
            firstName: `User${i + 1}`,
            lastName: `Lastname${i + 1}`,
            preferences: {
              image: {
                filename: "1KwMXL7egcHIenYzmvlECZ9pwtbFfNQGQ",
              },
            },
          };
          users.push(user);
        }
        // mock
        setSearchUserList(users);
      } else {
        setSearchUserList(null);
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <>
      {windowWidth > 768 ? (
        <>
          <div className="flex">
            <div className="w-full p-4">
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
                        <UserListItem key={user._id} user={user} />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-screen">
                <div className="bg-gray-200 p-4 h-full">
                  <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-11 w-11 rounded-full"
                            src="https://pbs.twimg.com/profile_images/1287562748562309122/4RLk5A_U_x96.jpg"
                          />
                          <div className="ml-1.5 text-sm leading-tight">
                            <span className="text-black dark:text-white font-bold block ">
                              Visualize Value
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 font-normal block">
                              @visualizevalue
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-black dark:text-white block text-xl leading-snug mt-3">
                        “No one ever made a decision because of a number. They
                        need a story.” — Daniel Kahneman
                      </p>
                      <div className="flex flex-wrap justify-center">
                        <div className="p-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                            // className="w-full h-auto"
                            alt="profile pic"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="p-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                            // className="w-full h-auto"
                            alt="profile pic"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="p-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                            // className="w-full h-auto"
                            alt="profile pic"
                            width={200}
                            height={200}
                          />
                        </div>
                        <div className="p-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                            // className="w-full h-auto"
                            alt="profile pic"
                            width={200}
                            height={200}
                          />
                        </div>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
                        10:05 AM · Dec 19, 2020
                      </p>
                      <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                      <div className="text-gray-500 dark:text-gray-400 flex mt-3">
                        <div className="flex items-center mr-6">
                          <span className="ml-3">615</span>
                        </div>
                        <div className="flex items-center mr-6">
                          <span className="ml-3">
                            93 people are Tweeting about this
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 mt-4 mr-2">
              <FollowingList followingList={followingList} />
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
                      <UserListItem key={user._id} user={user} />
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
                    {followingList &&
                      followingList.map((user) => (
                        <div key={user._id} className="w-full">
                          <div className="bg-white shadow-md p-4 mx-2 my-2 flex items-center h-48 w-48">
                            {user.preferences && user.preferences.image && (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${user.preferences.image.filename}`}
                                width={300}
                                height={300}
                                alt="profile pic"
                                className="w-16 h-16"
                              />
                            )}
                            <span>
                              {user.firstName} {user.lastName} @{user.username}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="bg-gray-200 p-4 h-full">
                <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-11 w-11 rounded-full"
                          src="https://pbs.twimg.com/profile_images/1287562748562309122/4RLk5A_U_x96.jpg"
                        />
                        <div className="ml-1.5 text-sm leading-tight">
                          <span className="text-black dark:text-white font-bold block ">
                            Visualize Value
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-normal block">
                            @visualizevalue
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-black dark:text-white block text-xl leading-snug mt-3">
                      “No one ever made a decision because of a number. They
                      need a story.” — Daniel Kahneman
                    </p>
                    <div className="flex flex-wrap justify-center">
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
                      10:05 AM · Dec 19, 2020
                    </p>
                    <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                    <div className="text-gray-500 dark:text-gray-400 flex mt-3">
                      <div className="flex items-center mr-6">
                        <span className="ml-3">615</span>
                      </div>
                      <div className="flex items-center mr-6">
                        <span className="ml-3">
                          93 people are Tweeting about this
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-11 w-11 rounded-full"
                          src="https://pbs.twimg.com/profile_images/1287562748562309122/4RLk5A_U_x96.jpg"
                        />
                        <div className="ml-1.5 text-sm leading-tight">
                          <span className="text-black dark:text-white font-bold block ">
                            Visualize Value
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-normal block">
                            @visualizevalue
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-black dark:text-white block text-xl leading-snug mt-3">
                      “No one ever made a decision because of a number. They
                      need a story.” — Daniel Kahneman
                    </p>
                    <div className="flex flex-wrap justify-center">
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
                      10:05 AM · Dec 19, 2020
                    </p>
                    <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                    <div className="text-gray-500 dark:text-gray-400 flex mt-3">
                      <div className="flex items-center mr-6">
                        <span className="ml-3">615</span>
                      </div>
                      <div className="flex items-center mr-6">
                        <span className="ml-3">
                          93 people are Tweeting about this
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-11 w-11 rounded-full"
                          src="https://pbs.twimg.com/profile_images/1287562748562309122/4RLk5A_U_x96.jpg"
                        />
                        <div className="ml-1.5 text-sm leading-tight">
                          <span className="text-black dark:text-white font-bold block ">
                            Visualize Value
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 font-normal block">
                            @visualizevalue
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-black dark:text-white block text-xl leading-snug mt-3">
                      “No one ever made a decision because of a number. They
                      need a story.” — Daniel Kahneman
                    </p>
                    <div className="flex flex-wrap justify-center">
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                      <div className="p-2">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_STORAGE_URL}10cAXiHyW5QvT2oy5Pi0viLvGHTdzHuqB`}
                          alt="profile pic"
                          width={200}
                          height={200}
                        />
                      </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-base py-1 my-0.5">
                      10:05 AM · Dec 19, 2020
                    </p>
                    <div className="border-gray-200 dark:border-gray-600 border border-b-0 my-1"></div>
                    <div className="text-gray-500 dark:text-gray-400 flex mt-3">
                      <div className="flex items-center mr-6">
                        <span className="ml-3">615</span>
                      </div>
                      <div className="flex items-center mr-6">
                        <span className="ml-3">
                          93 people are Tweeting about this
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
