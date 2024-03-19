import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

class NetworkManager {
  axiosInstance: AxiosInstance;

  constructor() {
    const platform = process.env.NEXT_PUBLIC_PLATFORM || "dev";

    if (platform == "dev") {
      this.axiosInstance = axios.create({
        proxy: {
          host: "127.0.0.1",
          port: 8080,
        },
      });
    } else {
      console.log("Env prod is working");
      this.axiosInstance = axios.create();
    }
  }

  async get(endpoint: string) {
    return await this.axiosInstance.get(endpoint);
  }

  async post(endpoint: string, requestBody: any) {
    try {
      const response = await this.axiosInstance.post(endpoint, requestBody);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      } else {
        return Promise.reject("Request setup error");
      }
    }
  }

  setAuthToken() {
    const token = localStorage.getItem("token");
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        if (typeof token == "string") {
          config.headers["Authorization"] = token;
        }
        config.headers["Access-Control-Allow-Origin"] = "*";
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }
}

export default NetworkManager;
