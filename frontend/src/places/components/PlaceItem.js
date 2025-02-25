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
        <Card>
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.desc}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMap}>
              VIEW ON MAP
            </Button>
            <Button to={`/places/${props.id}`} exact>
              EDIT
            </Button>
            <Button danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
