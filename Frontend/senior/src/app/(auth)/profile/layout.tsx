"use client";
import { useEffect } from "react";
import { selectIsAuthenticated } from "@/slices/auth.slice";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  }, []);

  return <main className="h-full"> {children} </main>;
}
