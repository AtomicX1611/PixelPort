import React, { useContext } from "react";
import Card from "../../shared/components/UiElements/Card";
import PlaceItem from "./PlaceItem"; 
import "./PLaceList.css";
import { AuthContext } from "../../context/AuthContext";

const PlaceList = ({ list }) => {

  const auth = useContext(AuthContext)
  
  if (list.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places Found. Create?</h2>
          <button>Share Place</button>
        </Card>
      </div>
    );
  }
   
  return (
    <ul className="place-list">
       {list.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.des}
          address={place.address}
          creatorId={place.creatorID}
          location={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
