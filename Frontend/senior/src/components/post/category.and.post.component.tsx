import { Category } from "@/interfaces/Category";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GetItemsByCurrentUserAndCategory } from "@/interfaces/item/get.items.by.user.and.category";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import {
  getDevUrl,
  getItemsByCurrentUserAndCategoryEndPoint,
} from "@/network/endpoints";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import LoadMoreButton from "../common/load.button";
import { toast } from "react-toastify";

const CategoryAndPostComponent = ({
  categories,
  setSelectedItems,
  setSelectedCategories,
  selectedCategories,
}: {
  categories: Category[];
  setSelectedItems: React.Dispatch<
    React.SetStateAction<GetItemsByCurrentUserAndCategory[]>
  >;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  selectedCategories: Category[];
}) => {
  const [category, setCategory] = useState<Category>();
  const [items, setItems] = useState<GetItemsByCurrentUserAndCategory[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<GetItemsByCurrentUserAndCategory | null>(null);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const [page, setPage] = useState<number>(0);

  const handleChangeCategory = (categoryName: string) => {
    try {
      console.log("category: ", category);
      if (categoryName === "") {
        const filteredCategories = selectedCategories.filter(
          (selectedCategory) => selectedCategory.name !== category?.name
        );
        setSelectedCategories(filteredCategories);
        return;
      }
      if (selectedCategories.some((cat) => cat.name === categoryName)) {
        toast.error("You cannot choose multiple times a category.");
        return;
      }

      const filteredCategories = selectedCategories.filter(
        (selectedCategory) => selectedCategory.name !== category?.name
      );
      setSelectedCategories(filteredCategories);

      console.log("filter: ", filteredCategories);

      const categoryE = categories.find((cat) => cat.name === categoryName);
      if (categoryE) {
        setCategory(categoryE);
        setSelectedCategories((prevCategories) => {
          const updatedCategories = [...prevCategories, categoryE];
          console.log("updated: ", updatedCategories);
          return updatedCategories;
        });
      }
      networkManager
        .post(getDevUrl(getItemsByCurrentUserAndCategoryEndPoint), {
          pageIndex: 0,
          pageSize: 5,
          categoryName: categoryName,
        })
        .then((response: ICustomResponse) => {
          setItems(response.data);
          setPage(1);
        })
        .catch((e) => {
          handleErrorResponse(e);
        });
    } catch (error) {
      console.log(error);

      handleErrorResponse(error);
    }
  };

  const handleLoadMoreItems = async () => {
    try {
      networkManager
        .post(getDevUrl(getItemsByCurrentUserAndCategoryEndPoint), {
          pageIndex: page,
          pageSize: 5,
          categoryName: category,
        })
        .then((response: ICustomResponse) => {
          if (response.success) {
            setItems((prevItems) => {
              return [...prevItems, ...response.data];
            });
            setPage((prevPage) => prevPage + 1);
          }
        })
        .catch((e) => {
          handleErrorResponse(e);
        });
    } catch (error) {
      console.log(error);
      handleErrorResponse(error);
    }
  };

  return (
    <>
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
            handleChangeCategory(e.target.value);
          }}
        >
          <option value="">Select a category</option>
          {selectedItem ? (
            <option key={category?._id} value={category?.name}>
              {category?.name}
            </option>
          ) : (
            categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <div
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 overflow-y-auto max-h-96"
          onChange={(e) => {
            const target = e.target as HTMLDivElement;
            console.log(target.getAttribute("data-value"));
          }}
        >
          {selectedItem ? (
            <div
              key={selectedItem._id}
              data-value={selectedItem._id}
              onClick={() => {
                setSelectedItem(null);
                setSelectedItems((prevItems) =>
                  prevItems.filter(
                    (preItem) => preItem._id !== selectedItem._id
                  )
                );
              }}
              className="cursor-pointer flex items-center space-x-2 p-2 transition duration-300 ease-in-out hover:bg-gray-200"
            >
              <Image
                src={
                  process.env.NEXT_PUBLIC_STORAGE_URL +
                  selectedItem.image.fileId
                }
                alt={selectedItem.title as string}
                width={100}
                height={100}
              />
              <span>{selectedItem.title}</span>
            </div>
          ) : (
            <>
              {items && items.length > 0 ? (
                <>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      data-value={item._id}
                      onClick={() => {
                        setSelectedItem(item);
                        setSelectedItems((prevItems) => [...prevItems, item]);
                      }}
                      className="cursor-pointer flex items-center space-x-2 p-2 transition duration-300 ease-in-out hover:bg-gray-200"
                    >
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_STORAGE_URL +
                          item.image.fileId
                        }
                        alt={item.title as string}
                        width={100}
                        height={100}
                      />
                      <span>{item.title}</span>
                    </div>
                  ))}
                  <LoadMoreButton onClick={handleLoadMoreItems} />
                </>
              ) : (
                <p>No item exist.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryAndPostComponent;
