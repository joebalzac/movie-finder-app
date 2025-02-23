import axios from "axios";
import { useEffect, useState } from "react";

const useData = <T>(endpoint: string | null) => {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!endpoint) return; 

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://api.themoviedb.org/3${endpoint}`, {
          params: {
            api_key: "585e3c362f1184df6a46acc6594ad300",
          },
        });
        setData(response.data.results);
      } catch (error) {
        setError("An unknown error has occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, isLoading, error };
};

export default useData;
