import React, { useState } from "react";
import Image from "next/image";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import useFormattedDate from "@/helpers/useFormattedDate.hook";

const SearchItemCardComponent = ({
  item,
  handleItemClicked,
}: {
  item: GetItemsByCurrentUser;
  handleItemClicked: (id: string) => void;
}) => {
  const { formatDate } = useFormattedDate();
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

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
      <div className="bg-gray-50 p-10 flex items-center justify-center w-[500px] rounded-xl hover:shadow-lg">
        <div className="bg-white border-gray-200 p-4 rounded-xl border max-w-xl min-h-[400px] relative">
          <div className="flex justify-between">
            <div className="w-72">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="ml-1.5 text-sm leading-tight">
                    <h2
                      onClick={() => handleItemClicked(item._id)}
                      className="text-lg font-semibold pr-2 hover:text-blue-400 cursor-pointer"
                    >
                      {item.title ? item.title : item.urlName}
                    </h2>
                    <span className="text-gray-500 font-normal block mt-1">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
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

export default SearchItemCardComponent;
