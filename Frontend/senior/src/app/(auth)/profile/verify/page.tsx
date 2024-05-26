"use client";
import React, { useState } from "react";
import NetworkManager from "@/network/network.manager";
import { getDevUrl, verifyResetPasswordEndPoint } from "@/network/endpoints";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authActions } from "@/slices/auth.slice";

const Verify = () => {
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");

  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const router = useRouter();
  const dispatchFromRedux = useDispatch();

  const handleOtpCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();

      if (otpCode) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(verifyResetPasswordEndPoint),
          {
            otpCode: otpCode,
            password: password,
          }
        );

        if (response.success) {
          toast.success("You successfully reset password. Please login");

          dispatchFromRedux(authActions.logout());
          return router.push("/login");
        } else {
          toast.error(response.message);
          return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify to reset password
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="otpCode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Otp Code
                  </label>
                  <input
                    type="text"
                    name="otpCode"
                    id="otpCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleOtpCodeChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <button
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={handleVerify}
                >
                  Verify
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Verify;
