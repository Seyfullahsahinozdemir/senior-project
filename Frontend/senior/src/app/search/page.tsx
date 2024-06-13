"use client";
import LoadMoreButton from "@/components/common/load.button";
import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import { getDevUrl, getSimilarItems } from "@/network/endpoints";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import SearchItemCardComponent from "@/components/item/search.item.card";
import { useRouter } from "next/navigation";

const SearchPage = () => {
  const [similarItems, setSimilarItems] = useState<GetItemsByCurrentUser[]>([]);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (allowedTypes.includes(selectedFile.type)) {
        try {
          const newFormData = new FormData();
          newFormData.append("image", selectedFile);
          newFormData.append("page", String(0));
          setFormData(newFormData);

          const token = localStorage.getItem("token");

          const response = await axios.post(
            getDevUrl(getSimilarItems),
            newFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
              },
            }
          );

          if (!response.data.success) {
            toast.error(`Error: ${response.data.errors}`);
            return;
          }
          setSelectedImage(URL.createObjectURL(selectedFile));
          setSimilarItems(response.data.data);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        toast.error("Only JPG and PNG files are allowed.");
      }
    }
  };

  const handleLoadMoreSimilarItems = async () => {
    const token = localStorage.getItem("token");

    const newFormData = new FormData();
    const image = formData.get("image");
    if (image) {
      newFormData.append("image", image);
    }
    const page = formData.get("page") as string | null;

    newFormData.append("page", String(parseInt(page || "0") + 1));
    setFormData(newFormData);

    const response = await axios.post(getDevUrl(getSimilarItems), newFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });
    console.log(response.data.data);
    setSimilarItems((prevItems) => [...prevItems, ...response.data.data]);
  };

  const handleItemClicked = (id: string) => {
    router.push(`/post/get-by-item/${id}`);
  };

  return (
    <>
      <div className="flex">
        <div className="w-full p-4">
          <div className="mb-4 flex flex-col justify-center items-center">
            <div className="bg-gray-50 p-4 w-96 rounded-xl">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 cursor-pointer hover:shadow-lg"
              >
                Choose File
              </label>
            </div>
            {selectedImage && (
              <div className="flex justify-center pt-3 hover:shadow-lg">
                <Image
                  src={selectedImage}
                  alt="selected"
                  width={200}
                  height={200}
                  className="w-48 h-72 rounded-md shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <hr />
      <div>
        <div className="flex items-center justify-center flex-wrap gap-3 pt-4">
          {selectedImage === null ? (
            <div>Please upload an image to find similar items.</div>
          ) : similarItems.length > 0 ? (
            <>
              {similarItems.map((item, index) => (
                <SearchItemCardComponent
                  key={index}
                  handleItemClicked={handleItemClicked}
                  item={item}
                />
              ))}
            </>
          ) : (
            "There is no similar items."
          )}
        </div>
        {similarItems.length > 0 && (
          <div className="flex justify-center py-2">
            <LoadMoreButton onClick={handleLoadMoreSimilarItems} />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
