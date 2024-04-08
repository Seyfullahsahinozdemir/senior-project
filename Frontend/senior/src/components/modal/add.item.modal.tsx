import React, { useEffect, useState } from "react";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import {
  getDevUrl,
  createItemEndPoint,
  uploadImageEndPoint,
  getCategoriesEndPoint,
} from "@/network/endpoints";
import { GrClose } from "react-icons/gr";
import { toast } from "react-toastify";
import axios from "axios";
import { Category } from "@/interfaces/Category";
import { ICustomResponse } from "@/interfaces/ICustomResponse";

const AddItemModal = ({
  show,
  setShow,
  onAddItem,
}: {
  setShow: (show: boolean) => void;
  show: boolean;
  onAddItem: () => void;
}) => {
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

  useEffect(() => {
    if (show) {
      networkManager
        .post(getDevUrl(getCategoriesEndPoint), {})
        .then((response: ICustomResponse) => {
          setCategories(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [show]);

  const handleAddButton = async () => {
    if (isSubmitting) return;

    try {
      const response = await networkManager.post(
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
        // Handle success
        onAddItem();
        setShow(false);
      }
    } catch (error) {
      console.error("Error adding item:", error);
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
      <dialog
        id="add_item_modal"
        className={`fixed modal inset-0 flex items-center justify-center z-50 w-[500px] mt-4 ${
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
                      htmlFor="urlName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      URL Name
                    </label>
                    <input
                      type="text"
                      name="urlName"
                      id="urlName"
                      className="bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={urlName}
                      onChange={(e) => setUrlName(e.target.value)}
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
                      className="bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="fileUpload"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Upload Image (JPG or PNG only)
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
                    onClick={handleAddButton}
                  >
                    {isSubmitting ? "Adding..." : "Add"}
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
                    "add_item_modal"
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

export default AddItemModal;
