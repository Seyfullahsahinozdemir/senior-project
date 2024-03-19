import Login from "@/app/(auth)/login/page";
import React from "react";
import { cookies } from "next/headers";

export default function withAuth<P extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<P>
) {
  // eslint-disable-next-line react/display-name
  return (props: React.PropsWithChildren<P>) => {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (typeof token !== "string") {
      return React.createElement(Login, props);
    }

    return React.createElement(WrappedComponent, props);
  };
}
