import React, { useState } from "react";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import {
  getDevUrl,
  updateUserEndPoint,
  uploadImageEndPoint,
} from "@/network/endpoints";
import { GrClose } from "react-icons/gr";
import { User } from "@/interfaces/User";
import { toast } from "react-toastify";
import axios from "axios";

const EditProfileModal = ({
  show,
  setShow,
  info,
  onUpdateUser,
}: {
  setShow: (show: boolean) => void;
  info: User;
  show: boolean;
  onUpdateUser: (updatedUser: User) => void;
}) => {
  const [user, setUser] = useState<User>(info);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{
    filename: string;
    fileId: string;
    mimetype: string;
  }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleEditButton = async () => {
    if (isSubmitting) return;

    try {
      const response = await networkManager.post(
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
        onUpdateUser(user);
        setShow(false);
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
        setFile(selectedFile);
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
      <dialog
        id="my_modal_4"
        className={`fixed inset-0 flex items-center justify-center z-50 w-[500px] mt-4 ${
          show ? "block" : "hidden"
        }`}
      >
        <div className="modal-background fixed inset-0 bg-black opacity-50"></div>
        <div className="modal-box p-2 w-full relative overflow-y-auto max-h-[700px]">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full bg-white rounded-lg">
              <div className="space-y-4 md:space-y-6 sm:p-8">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={user.firstName}
                      onChange={(e) => {
                        setUser((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={user.lastName}
                      onChange={(e) => {
                        setUser((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        user.preferences?.gender
                          ? user.preferences.gender
                          : "prefer-not-to-say"
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
                      <option value="prefer-not-to-say">
                        Prefer Not to Say
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Contact No
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        user.preferences?.phone ? user.preferences.phone : ""
                      }
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
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        user.preferences?.address
                          ? user.preferences.address
                          : ""
                      }
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
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      About
                    </label>
                    <textarea
                      name="about"
                      id="about"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={
                        user.preferences?.about ? user.preferences.about : ""
                      }
                      onChange={(e) => {
                        setUser((prevUser) => ({
                          ...prevUser,
                          preferences: {
                            ...prevUser.preferences,
                            about: e.target.value,
                          },
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="fileUpload"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Upload Profile Picture (JPG or PNG only)
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png"
                      name="fileUpload"
                      id="fileUpload"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full text-gray-900 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleEditButton}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <div>
              <GrClose
                className="btn absolute top-1 right-4 hover:border rounded-md w-7 h-7 m-2"
                onClick={() => {
                  const modal: HTMLDialogElement = document.getElementById(
                    "my_modal_4"
                  ) as HTMLDialogElement;

                  modal.close();
                  setShow(false);
                }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
