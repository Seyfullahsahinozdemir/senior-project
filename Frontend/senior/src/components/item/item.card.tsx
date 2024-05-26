import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineDelete, AiOutlineSave, AiFillSave } from "react-icons/ai";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import DeleteItemModal from "../modal/delete.item.modal";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import {
  addFavoriteItemEndPoint,
  deleteFavoriteItemEndPoint,
  getDevUrl,
} from "@/network/endpoints";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { toast } from "react-toastify";

const ItemCardComponent = ({
  item,
  handleRemoveItem,
}: {
  item: GetItemsByCurrentUser;
  handleRemoveItem: (item: GetItemsByCurrentUser) => void;
}) => {
  const { formatDate } = useFormattedDate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { handleErrorResponse } = useErrorHandling();
  const [saved, setSaved] = useState<boolean>(item.onFavorite);
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

  const handleOverlayClick = () => {
    setShowDeleteModal(false);
  };

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
      {showDeleteModal && (
        <DeleteItemModal
          item={item}
          show={showDeleteModal}
          setShow={setShowDeleteModal}
          onDeleteItem={handleRemoveItem}
        />
      )}
      <div className="bg-gray-50 p-8 flex items-center justify-center rounded-3xl hover:shadow-xl min-h-[600px]">
        {showDeleteModal && (
          <div className="overlay" onClick={handleOverlayClick}></div>
        )}

        <div className="bg-white border-gray-200 p-4 rounded-xl border relative w-96">
          <div className="absolute top-0 right-0 p-4 flex items-center">
            <div
              onClick={handleSaveToCollection}
              className="cursor-pointer hover:shadow-2xl mr-4"
            >
              {saved ? (
                <AiFillSave className="text-green-600 text-2xl rounded-full" />
              ) : (
                <AiOutlineSave className="text-blue-600 text-2xl rounded-full" />
              )}
            </div>

            <div
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer hover:shadow-2xl"
            >
              <AiOutlineDelete className="text-red-600 text-2xl rounded-full" />
            </div>
          </div>
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

          <p className="block text-lg leading-snug mt-3 font-thin">
            {renderDescription()}
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

export default ItemCardComponent;
