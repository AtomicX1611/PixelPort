import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hook.js";

const UserPlaces = () => {
  const userID = useParams().userId;
  console.log("User Places called by ", userID);
  
  const [places, setPlaces] = useState([]);
  const { loading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/user/${userID}`
        );

        const response = await data;
        console.log("Response : ", response);
        setPlaces(response.places || []);
      } catch (err) {
        console.log("Error : ",err)
        console.log("Error occured");
      }
    };

    fetchPlaces();
  }, [sendRequest,userID]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== deletedPlaceId));
  };

  return (
    <React.Fragment>
      <PlaceList 
        list={places} 
        userId={userID} 
        onPlaceDeleted={placeDeletedHandler}
      />
    </React.Fragment>
  );
};

export default UserPlaces;
