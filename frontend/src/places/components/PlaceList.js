import React, { useContext } from "react";
import Card from "../../shared/components/UiElements/Card";
import PlaceItem from "./PlaceItem"; 
import "./PLaceList.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


const PlaceList = ({ list, userId, onPlaceDeleted }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate('/places/new');
  };
  if (list.length === 0) {
    if(userId !== auth.userId){
      return(
        <div className="place-list center">
          <div className="no-places-card">
            <h2>User has no places uploaded</h2>
          </div>
        </div>
      )
    }
    return (
      <div className="place-list center">
        <div className="no-places-card">
          <h2>Share Your First Place</h2>
          <button className="share-place-button" onClick={onClickHandler}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Share Place
          </button>
        </div>
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
          onDelete={onPlaceDeleted}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
