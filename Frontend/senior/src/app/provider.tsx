"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/store/store";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
