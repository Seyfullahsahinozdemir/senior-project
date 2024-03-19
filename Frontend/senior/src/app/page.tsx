"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { selectIsAuthenticated } from "@/slices/auth.slice";

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return redirect("/login");
  }
  return <h1>Hello, Home page!</h1>;
}
