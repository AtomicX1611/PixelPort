import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hook.js";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     desc: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creatorID: "u1",
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     desc: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creatorID: "u2",
//   },
// ];

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

  return (
    <React.Fragment>

      <PlaceList list={places} />
    </React.Fragment>
  );
};

export default UserPlaces;
