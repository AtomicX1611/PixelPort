import React, { useContext } from "react";
import Card from "../../shared/components/UiElements/Card";
import PlaceItem from "./PlaceItem"; 
import "./PLaceList.css";


const PlaceList = ({ list }) => {

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
          key={place._id}
          id={place._id}
          image={place.imageUrl}
          title={place.title}
          description={place.desc}
          address={place.address}
          creatorId={place.creatorID}
          location={place.location}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
