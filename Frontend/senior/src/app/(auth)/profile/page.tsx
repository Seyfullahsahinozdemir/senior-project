"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import NetworkManager from "@/network/network.manager";
import {
  getDevUrl,
  getProfileEndPoint,
  resetPasswordEndpoint,
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

const MyProfilePage = () => {
  const [user, setUser] = useState<User>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { formatDate } = useFormattedDate();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    if (!showModal) {
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
  }, [showModal]);

  const onUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
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

  return (
    <div>
      {user && (
        <EditProfileModal
          show={showModal}
          setShow={setShowModal}
          info={user}
          onUpdateUser={onUpdateUser}
        />
      )}
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
                  onClick={() => setShowModal(true)}
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
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10"
                  // onClick={handleResetPasswordClick}
                >
                  Posts
                </button>
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm w-1/4 ml-3 h-10"
                  // onClick={handleResetPasswordClick}
                >
                  Items
                </button>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
                {/* <PostCardComponent post={} />
                <PostCardComponent />
                <PostCardComponent /> */}

                {/* {user?.favorites.map((movie: IMovie, index: number) => (
                  <MovieItem movie={movie} index={index} />
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
