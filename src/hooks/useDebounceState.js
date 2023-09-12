import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const useDebounceState = () => {
  const [state, setState] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const removable = ["page"];

      removable.forEach((element) => searchParams.delete(element));

      for (let key in state) {
        if (state[key]) {
          searchParams.set(key, state[key]);
        }else{
          searchParams.delete(key);
        }
      }

      setSearchParams(searchParams);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [state, 3000]);

  return [state, setState];
};

export default useDebounceState;
