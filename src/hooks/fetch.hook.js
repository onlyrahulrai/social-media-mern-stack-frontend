import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";
import { useAuthStore } from "../store/store";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

export default function useFetch(query) {
  const [getData, setData] = useState({
    loading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });
  const { setAuth } = useAuthStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true }));

        const { username } = !query ? await getUsername() : "";

        const { data, status } = !query
          ? await axios.get(`/user/${username}`)
          : await axios.get(`${query}`);

        if (status === 200) {
          setAuth(data);
          setData((prev) => ({
            ...prev,
            loading: false,
            apiData: data,
            status,
          }));
        }

        setData((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        setData((prev) => ({ ...prev, loading: false, serverError: error }));
      }
    };

    fetchData();
  }, []);

  return [getData, setData];
}
