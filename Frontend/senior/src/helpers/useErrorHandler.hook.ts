import { useRouter } from "next/navigation";
import { authActions } from "@/slices/auth.slice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const useErrorHandling = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleErrorResponse = (err: any) => {
    if (err.response && err.response.status === 401) {
      toast.error("Jwt expired, please login.");
      dispatch(authActions.logout());
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      dispatch(authActions.logout());
      toast.error("Cannot access API");
    }
  };

  return { handleErrorResponse };
};

export default useErrorHandling;
