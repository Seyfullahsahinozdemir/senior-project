import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import DeleteItemModal from "../modal/delete.item.modal";

const ItemCardComponent = ({
  item,
  handleRemoveItem,
}: {
  item: GetItemsByCurrentUser;
  handleRemoveItem: (item: GetItemsByCurrentUser) => void;
}) => {
  const { formatDate } = useFormattedDate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleOverlayClick = () => {
    setShowDeleteModal(false);
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
      <div className="bg-gray-50 dark:bg-black p-10 flex items-center justify-center w-[500px]">
        {showDeleteModal && (
          <div className="overlay" onClick={handleOverlayClick}></div>
        )}

        <div className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800 p-4 rounded-xl border max-w-xl relative">
          <div className="absolute top-0 right-0 p-4">
            <div
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer hover:shadow-2xl"
            >
              <AiOutlineDelete className="text-red-600 dark:text-red-500 text-2xl rounded-full" />
            </div>
          </div>
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
          </div>
          <p className="text-black dark:text-white block text-xl leading-snug mt-3">
            {item.description}
          </p>
          {/* {item.subCategories && item.subCategories.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-600">Subcategories:</span>
              <ul className="list-disc list-inside">
                {item.subCategories.map(
                  (subCategory: string, index: number) => (
                    <li key={index} className="text-gray-600">
                      {subCategory}
                    </li>
                  )
                )}
              </ul>
            </div>
          )} */}
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
