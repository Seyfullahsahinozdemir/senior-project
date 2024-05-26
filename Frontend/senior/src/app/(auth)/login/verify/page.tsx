"use client";
import React, { useState } from "react";
import NetworkManager from "@/network/network.manager";
import { getDevUrl, loginVerifyEndpoint } from "@/network/endpoints";
import { useAxiosWithoutAuthentication } from "@/helpers/without.auth.axios.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { authActions } from "@/slices/auth.slice";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const Verify = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const rememberMe = searchParams.get("rememberMe");

  const [otpCode, setOtpCode] = useState("");
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const router = useRouter();
  const dispatchFromRedux = useDispatch();
  const { handleErrorResponse } = useErrorHandling();

  const handleOtpCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value);
  };

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();

      if (otpCode) {
        const response: ICustomResponse = await networkManager.post(
          getDevUrl(loginVerifyEndpoint),
          {
            email,
            otpCode,
          }
        );

        if (response.success) {
          if (rememberMe == "true") {
            localStorage.setItem("rememberMe", "true");
          } else if (rememberMe == "false") {
            localStorage.setItem("rememberMe", "false");
          }

          dispatchFromRedux(
            authActions.login({
              token: response.data.token,
              isAdmin: response.data.isAdmin,
            })
          );
          router.push("/");
        } else {
          toast.error(`Error: ${response.data.errors}`);
          return;
        }
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Verify to login
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

                <button
                  type="submit"
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
