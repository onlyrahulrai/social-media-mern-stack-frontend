import axios from "axios";
import { useAuthStore } from "../store/store";

const getAuthTokens = () =>
  localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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
    if(response.data?.userConfig){
      useAuthStore.setState((state) => {
        return {...state,auth:{...state.auth,...response.data?.userConfig}}
      })
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error response is a 401 and the original request had an access token,
    // try refreshing the access token and retry the original request
    if (
      error?.response?.status === 401 &&
      originalRequest.headers.Authorization
    ) {
      originalRequest._retry = true;

      const refresh = getAuthTokens()?.refresh;

      const { data } = await axios.post("/token/refresh", { refresh });

      localStorage.setItem("authTokens", JSON.stringify(data));

      originalRequest.headers.Authorization = `Bearer ${data?.access}`;

      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

axiosInstance.deauthorize = () => {
  delete axiosInstance.defaults.headers.common["Authorization"];
};

export default axiosInstance;
