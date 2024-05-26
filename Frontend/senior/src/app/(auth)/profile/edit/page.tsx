"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkManager from "@/network/network.manager";
import {
  getDevUrl,
  getProfileEndPoint,
  updateUserEndPoint,
  uploadImageEndPoint,
} from "@/network/endpoints";
import { useRouter } from "next/navigation";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { User } from "@/interfaces/User";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import axios from "axios";

const EditProfilePage = () => {
  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    preferences: {
      gender: "",
      phone: "",
      address: "",
      about: "",
      image: { filename: "", mimetype: "" },
    },
    following: undefined,
    followers: undefined,
  });
  const [uploadedImage, setUploadedImage] = useState<{
    filename: string;
    fileId: string;
    mimetype: string;
  }>();
  const router = useRouter();

  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    networkManager
      .post(getDevUrl(getProfileEndPoint), {})
      .then((response) => {
        if (response.success) {
          setUser(response.data.user);
        }
        console.log(response.data);
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  const handleEditButton = async () => {
    if (isSubmitting) return;

    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(updateUserEndPoint),
        {
          preferences: {
            gender: user.preferences.gender,
            phone: user.preferences.phone,
            address: user.preferences.address,
            about: user.preferences.about,
            image: { filename: uploadedImage ? uploadedImage.fileId : "" },
          },
          firstName: user.firstName,
          lastName: user.lastName,
        }
      );

      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    setIsSubmitting(true);
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (allowedTypes.includes(selectedFile.type)) {
        try {
          const formData = new FormData();
          formData.append("image", selectedFile);

          const token = localStorage.getItem("token");

          const response = await axios.post(
            getDevUrl(uploadImageEndPoint),
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );

          setUploadedImage(response.data.data.image);
        } catch (error) {
          console.error("Error uploading file:", error);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        toast.error("Only JPG and PNG files are allowed.");
      }
    }
  };

  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                Edit Profile Form
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.username}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        username: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.firstName}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        firstName: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.lastName}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        lastName: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={
                      user?.preferences.gender
                        ? user.preferences.gender
                        : "not_to_say"
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          gender: e.target.value,
                        },
                      }));
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="not_to_say">Not to Say</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="contactNo"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Contact No
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    id="contactNo"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.preferences.phone}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          phone: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.preferences.address}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          address: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="about"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    About
                  </label>
                  <textarea
                    name="about"
                    id="about"
                    rows={4}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    value={user?.preferences.about}
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          about: e.target.value,
                        },
                      }));
                    }}
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="profilePicture"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Upload Profile Picture
                  </label>
                  <input
                    type="file"
                    accept=".jpg, .png"
                    name="profilePicture"
                    id="profilePicture"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="profilePicture"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
                <button
                  type="submit"
                  className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  onClick={handleEditButton}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfilePage;
