import React from "react";

interface ButtonProps {
  onClick: () => void;
}

const LoadMoreButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <button
      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-6 py-2"
      onClick={onClick}
    >
      Load More
    </button>
  );
};

export default LoadMoreButton;
