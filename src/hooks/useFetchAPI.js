import { useEffect, useState } from "react";
import axiosInstance from "../api/base";

export default function useFetchAPI(query) {
  const [state, setState] = useState({
    loading: false,
    data: undefined,
    status: null,
    serverError: null,
  });

  const fetchData = async () => {
    try {
      if (!query) return;

      setState((prev) => ({ ...prev, loading: true }));

      const { data, status } = await axiosInstance.get(query);

      if (status === 200) {
        setState((prev) => ({ ...prev, loading: false, data, status }));
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false, serverError: error }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function refetch(){
    fetchData();
  };

  return [state, setState,refetch];
}
