"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NetworkManager from "@/network/network.manager";
import {
  createItemEndPoint,
  getCategoriesEndPoint,
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
import { Category } from "@/interfaces/Category";

const AddItemPage = () => {
  const [urlName, setUrlName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<{
    filename: string;
    fileId: string;
    mimetype: string;
  }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const networkManager: NetworkManager = useAxiosWithAuthentication();

  const { handleErrorResponse } = useErrorHandling();
  const router = useRouter();

  useEffect(() => {
    networkManager
      .post(getDevUrl(getCategoriesEndPoint), {})
      .then((response: ICustomResponse) => {
        setCategories(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleAddButton = async () => {
    if (isSubmitting) return;

    try {
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(createItemEndPoint),
        {
          urlName: urlName,
          title: title,
          description: description,
          topCategory: category,
          image: {
            filename: uploadedImage?.filename,
            fileId: uploadedImage?.fileId,
          },
        }
      );

      if (response.success) {
        toast.success(response.message);
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    } catch (error) {
      handleErrorResponse(error);
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
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add Item Form
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="urlName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="urlName"
                    id="urlName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setUrlName(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="title"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="itemPicture"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Upload Item Picture
                  </label>
                  <input
                    type="file"
                    accept=".jpg, .png"
                    name="itemPicture"
                    id="itemPicture"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="itemPicture"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    Choose File
                  </label>
                </div>
                <button
                  type="submit"
                  className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  onClick={handleAddButton}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddItemPage;
