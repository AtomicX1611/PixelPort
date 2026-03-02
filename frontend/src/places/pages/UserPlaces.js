import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hook.js";

const UserPlaces = () => {
  const userID = useParams().userId;
  
  const [places, setPlaces] = useState([]);
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userID}`
        );

        setPlaces(response.places || []);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest,userID]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place._id !== deletedPlaceId));
  };

  return (
    <PlaceList 
      list={places} 
      userId={userID} 
      onPlaceDeleted={placeDeletedHandler}
    />
  );
};

export default UserPlaces;
