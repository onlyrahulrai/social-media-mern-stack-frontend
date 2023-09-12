import axios from "axios";
import { useAuthStore } from "../store/store";
import { isAuthTokenExpired } from "../helper/validate";

export const getAuthTokens = () =>
  localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${getAuthTokens()?.access}`,
  },
});

axiosInstance.authorize = (token) => {
  const authTokens = getAuthTokens();

  token = token || authTokens?.access;

  if (authTokens?.access) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
};

axiosInstance.interceptors.request.use(async function(config) {
  // Set the Authorization header with a token
  const token = getAuthTokens()?.access;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor for API calls
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data?.userConfig) {
      useAuthStore.setState((state) => {
        return {
          ...state,
          auth: { ...state.auth, ...response.data?.userConfig },
        };
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest.headers.Authorization
    ) {
      const access = originalRequest.headers.Authorization.replace(
        "Bearer",
        ""
      ).trim();

      const refresh = getAuthTokens()?.refresh;

      if (isAuthTokenExpired(access) && !isAuthTokenExpired(refresh)) {
        originalRequest._retry = true;

        return await axios
          .post(`${process.env.REACT_APP_API_URL}/token/refresh/`, { refresh })
          .then(({ data }) => {
            localStorage.setItem(
              "authTokens",
              JSON.stringify({ access: data.access, refresh })
            );

            originalRequest.headers.Authorization = `Bearer ${data?.access}`;

            return axiosInstance(originalRequest)
          })
          .catch((error) => {
            Promise.resolve(localStorage.removeItem("authTokens")).then(() =>
              Promise.reject(error)
            );
          });
      }
    }
  }
);

axiosInstance.deauthorize = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;
