import React, { useContext } from "react";
import Card from "../../shared/components/UiElements/Card";
import PlaceItem from "./PlaceItem"; 
import "./PLaceList.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const PlaceList = ({ list, userId }) => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const onClickHandler = () => {
    navigate('/places/new')
  }
  if (list.length === 0) {
    if(userId !== auth.userId){
      return(
        <div className="place-list center">
           <Card>
            <h2>User has no places uploaded.</h2>
           </Card>
        </div>
      )
    }
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places Found. Create?</h2>
          <button onClick={onClickHandler}>Share Place</button>
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
