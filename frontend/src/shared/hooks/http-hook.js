import React from "react";

const httpClient = async (props) => {
  const response = await fetch(props.url, {
    method: props.method,
    headers: props.methods,
    body: props.body,
  });
  
  const responseData = await response.json();
  return responseData;
};

export default httpClient;