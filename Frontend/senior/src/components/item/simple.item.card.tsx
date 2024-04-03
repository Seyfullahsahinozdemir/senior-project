import React, { useState } from "react";
import Image from "next/image";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import { AiFillSave } from "react-icons/ai";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import {
  addFavoriteItemEndPoint,
  deleteFavoriteItemEndPoint,
  getDevUrl,
} from "@/network/endpoints";
import { toast } from "react-toastify";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const SimpleItemCardComponent = ({ item }: { item: GetItemsByCurrentUser }) => {
  const { formatDate } = useFormattedDate();
  const [saved, setSaved] = useState<boolean>(item.onFavorite);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  const handleSaveToCollection = async () => {
    try {
      if (!saved) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(addFavoriteItemEndPoint),
          {
            itemId: item._id,
          }
        );

        if (response.success) {
          toast.success(response.message);
          setSaved(true);
        } else {
          toast.error(response.data.errors);
        }
      } else {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(deleteFavoriteItemEndPoint),
          {
            itemId: item._id,
          }
        );

        if (response.success) {
          toast.success(response.message);
          setSaved(false);
        } else {
          toast.error(response.data.errors);
        }
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center w-[500px]">
        <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl relative">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="ml-1.5 text-sm leading-tight">
                <h2 className="text-lg font-semibold pr-2">
                  {item.title ? item.title : item.urlName}
                </h2>
                <span className="text-gray-500 dark:text-gray-400 font-normal block">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
            <div
              onClick={handleSaveToCollection}
              className="cursor-pointer hover:shadow-2xl mr-4"
            >
              {saved ? (
                <AiFillSave className="text-green-600 dark:text-green-500 text-2xl rounded-full" />
              ) : (
                <AiFillSave className="text-blue-600 dark:text-blue-500 text-2xl rounded-full" />
              )}
            </div>
          </div>
          <p className="text-black dark:text-white block text-xl leading-snug mt-3">
            {item.description}
          </p>
          {item.image.filename && (
            <div className="flex justify-center mt-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.image.fileId}`}
                alt="item image"
                width={200}
                height={200}
                className="w-48 h-72 rounded-md shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SimpleItemCardComponent;
