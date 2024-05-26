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
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

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

  const renderDescription = () => {
    if (!item.description) return;
    if (item.description.length <= 100) {
      return item.description;
    }

    if (showFullDescription) {
      return (
        <>
          {item.description}{" "}
          <button
            onClick={() => setShowFullDescription(false)}
            className="text-blue-600 hover:underline"
          >
            Show less
          </button>
        </>
      );
    } else {
      return (
        <>
          {item.description.substring(0, 100)}...{" "}
          <button
            onClick={() => setShowFullDescription(true)}
            className="text-blue-600 hover:underline"
          >
            Show more
          </button>
        </>
      );
    }
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center w-[500px] rounded-xl hover:shadow-lg">
        <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl relative">
          <div className="flex justify-between">
            <div className="w-72">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="ml-1.5 text-sm leading-tight">
                    <h2 className="text-lg font-semibold pr-2">
                      {item.title ? item.title : item.urlName}
                    </h2>
                    <span className="text-gray-500 font-normal block mt-1">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
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
          <p className="block text-lg leading-snug mt-3 font-thin">
            {renderDescription()}
          </p>
          {item.image.filename && (
            <div className="flex justify-center mt-4">
              <div className="p-2 border-2 w-64 h-64 flex justify-center items-center hover:shadow-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}${item.image.fileId}`}
                  alt="Item"
                  width={150}
                  height={150}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SimpleItemCardComponent;
