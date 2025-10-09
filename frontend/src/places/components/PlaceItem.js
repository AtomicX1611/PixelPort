import React from "react";
import { useState } from "react";

import Card from "../../shared/components/UiElements/Card.js";
import "./PlaceItem.css";
import Button from "../../shared/components/UiElements/Button.js";
import Modal from "../../shared/components/UiElements/Modal.js";
import GMap from "../../shared/components/UiElements/Map.js";

const PlaceItem = (props) => {
  const [gMap, setGMap] = useState(false);
  const closeMap = (e) => {
    setGMap(false);
    e.preventDefault();
  };
  const openMap = (e) => {
    setGMap(true);
    e.preventDefault();
  };

  return (
    <React.Fragment>
      <Modal
        show={gMap}
        onCancel={closeMap}
        header={props.address}
        contentClass="place-item__modal__content"
        footerClass="place-item__modal__actions"
        footer={<Button onClick={closeMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <GMap lat={props.location.lat} lng={props.location.lng} />
        </div>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.desc}</p>
          </div>
          <div className="place-item__actions">
            <Button className="view-map-btn" onClick={openMap}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Map
            </Button>
            <Button className="edit-btn" to={`/places/${props.id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
            <Button className="delete-btn" danger>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
