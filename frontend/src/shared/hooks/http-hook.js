import  {useCallback, useEffect, useRef, useState } from "react";

const useHttpClient = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  // const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      setError(null);
      console.log("Calling send request in custom hook")
      // const httpAbortController = new AbortController();
      // activeHttpRequest.current.push(httpAbortController);
      try {
        console.log("posting place,",method,body,headers)
        const response = await fetch(url, {
          method,
          body,
          headers,
          // signal : httpAbortController.signal
        });
         
        const responseData = await response.json()
        console.log("response in hook : ",responseData)

        // activeHttpRequest.current = activeHttpRequest.current.filter(
        //   (reqCtrl) => reqCtrl !== httpAbortController
        // );

        if (!response.ok) {
          throw new Error(responseData.message || "Request failed!");
        }
        setLoading(false);
        return responseData;
      } catch (error) {
        console.log("Error Occurred in send request: ", error);
        console.log("Error Occurred in send request: ", error.message);
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

  // useEffect(() => {
  //   return () => activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
  // }, []);

  return { loading, error, sendRequest, clearError };
};

export default useHttpClient;
