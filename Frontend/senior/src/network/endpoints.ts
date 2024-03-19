export const baseURLForDev = "http://localhost:3000/api/v1";
export const baseURLForProd = "";

// auth
export const registerEndpoint = "/auth/register";
export const loginEndpoint = "/auth/login";
export const loginVerifyEndpoint = "/auth/verify-login";

export const getProdUrl = (url: string) => baseURLForProd + url;

export const getDevUrl = (url: string) => baseURLForDev + url;
