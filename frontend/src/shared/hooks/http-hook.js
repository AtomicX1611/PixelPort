import { useCallback, useState } from "react";

const useHttpClient = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
        });
         
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }
        setLoading(false);
        return responseData;
      } catch (error) {
        setError(error.message);
        setLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { loading, error, sendRequest, clearError };
};

export default useHttpClient;
