"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  authActions,
  selectIsAuthenticated,
  selectIsAdmin,
} from "@/slices/auth.slice";

const Navbar = () => {
  const dispatch = useDispatch();
  const [selectedMenu, setSelectedMenu] = useState("movies");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  useEffect(() => {
    const beforeUnloadHandler = () => {
      if (localStorage.getItem("rememberMe") !== "true") {
        dispatch(authActions.logout());
      }
    };

    if (typeof window !== "undefined") {
      window.onbeforeunload = beforeUnloadHandler;
    }

    return () => {
      if (typeof window !== "undefined") {
        window.onbeforeunload = null;
      }
    };
  }, [dispatch]);

  return (
    <nav className="bg-white border-solid border-b-2 border-indigo-600 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Senior
          </span>
        </Link>
        <button
          className="md:hidden outline-none focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-gray-900 dark:text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12M6 12h12"></path>
            ) : (
              <path d="M4 6h16M4 12h16m-7 6h7"></path>
            )}
          </svg>
        </button>
        {isAuthenticated ? (
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/movies"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "movies"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => {
                    setSelectedMenu("movies");
                    setIsMenuOpen(false);
                  }}
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block py-2 pl-3 pr-4 ${
                    selectedMenu == "profile"
                      ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                      : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                  }`}
                  aria-current="page"
                  onClick={() => {
                    setSelectedMenu("profile");
                    setIsMenuOpen(false);
                  }}
                >
                  Profile
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin/dashboard"
                    className={`block py-2 pl-3 pr-4 ${
                      selectedMenu == "dashboard"
                        ? "text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                        : "text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0"
                    }`}
                    aria-current="page"
                    onClick={() => {
                      setSelectedMenu("dashboard");
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <a
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isMenuOpen ? "block" : "hidden"
            }`}
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  href="/login"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
