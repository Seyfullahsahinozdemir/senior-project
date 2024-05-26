"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import NetworkManager from "@/network/network.manager";
import {
  getCategoriesEndPoint,
  getDevUrl,
  postCreateEndPoint,
} from "@/network/endpoints";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { Category } from "@/interfaces/Category";
import CategoryAndPostComponent from "@/components/post/category.and.post.component";
import { GetItemsByCurrentUserAndCategory } from "@/interfaces/item/get.items.by.user.and.category";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AddPostPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const [selectedItems, setSelectedItems] = useState<
    GetItemsByCurrentUserAndCategory[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [componentCount, setComponentCount] = useState(1);
  const [content, setContent] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    networkManager
      .post(getDevUrl(getCategoriesEndPoint), {})
      .then((response: ICustomResponse) => {
        setCategories(response.data);
      })
      .catch((e) => {
        handleErrorResponse(e);
      });
  }, []);

  const handleAddButton = async () => {
    try {
      const items = [];
      for (const item of selectedItems) {
        items.push(item._id);
      }
      const response: ICustomResponse = await networkManager.post(
        getDevUrl(postCreateEndPoint),
        {
          content,
          items,
        }
      );

      if (response.success) {
        toast.success(response.message);
        setTimeout(() => router.push("/profile"), 1200);
      } else {
        toast.error(response.data.errors.join(", "));
      }
    } catch (error) {
      console.log(error);
      handleErrorResponse(error);
    }
  };

  const handleAddComponent = () => {
    if (componentCount < 5) {
      setComponentCount(componentCount + 1);
    } else {
      setComponentCount(5);
      toast.error("You can add a maximum of 5 items.");
    }
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-4">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Add Post Form
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="content"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Content
                  </label>
                  <textarea
                    name="content"
                    id="content"
                    rows={4}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  ></textarea>
                </div>

                {[...Array(componentCount)].map((_, index) => (
                  <CategoryAndPostComponent
                    key={index}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedItems={setSelectedItems}
                    setSelectedCategories={setSelectedCategories}
                  />
                ))}

                <div className="flex justify-end">
                  {" "}
                  <button
                    type="button"
                    onClick={handleAddComponent}
                    className="flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    <FaPlus />
                  </button>
                </div>

                <button
                  type="submit"
                  className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  onClick={() => {
                    handleAddButton();
                  }}
                >
                  Add Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddPostPage;
