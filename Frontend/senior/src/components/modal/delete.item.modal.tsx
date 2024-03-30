import { GetItemsByCurrentUser } from "@/interfaces/item/get.items.by.current.user";
import React from "react";
import { GrClose } from "react-icons/gr";

const DeleteItemModal = ({
  item,
  show,
  setShow,
  onDeleteItem,
}: {
  item: GetItemsByCurrentUser;
  show: boolean;
  setShow: (show: boolean) => void;
  onDeleteItem: (item: GetItemsByCurrentUser) => void;
}) => {
  return (
    <dialog
      id="delete_item_modal"
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        show ? "block" : "hidden"
      }`}
    >
      <div className="modal-background fixed inset-0 bg-black opacity-50"></div>
      <div className="modal-box p-4 max-w-md relative bg-white rounded-lg shadow-lg">
        <h3 className="font-bold text-lg mb-4">Delete Item</h3>
        <hr />
        <div className="flex flex-col items-center justify-center mb-4">
          <p className="text-center my-4">Do you want to delete the item?</p>
          <div className="flex justify-between">
            <button
              onClick={() => {
                onDeleteItem(item);
                setShow(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => setShow(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              No
            </button>
          </div>
        </div>
        <div className="modal-action">
          <div>
            <GrClose
              className="btn absolute top-1 right-4 hover:border rounded-md w-7 h-7 m-2"
              onClick={() => setShow(false)}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteItemModal;