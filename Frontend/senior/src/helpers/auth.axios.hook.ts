import NetworkManager from "@/network/network.manager";

export const useAxiosWithAuthentication = () => {
  const networkManager = new NetworkManager();
  networkManager.setAuthToken();
  return networkManager;
};
