import NetworkManager from "@/network/network.manager";

export const useAxiosWithoutAuthentication = () => {
  const networkManager = new NetworkManager();
  return networkManager;
};
