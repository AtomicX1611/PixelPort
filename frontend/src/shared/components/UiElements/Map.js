import React, { useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const styles = {
  height: "100%",
  width: "100%",
};

const GMap = (props) => {
    const center = {
        lat: props.lat,
        lng: props.lng,
      };

  const [map, setMap] = useState(null);
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCTwWaMfZKWY3BSd6h62gVR0mAyJFJRQxY",
    id: "google-map-script",
  });

  const onLoad = React.useCallback((mapInst)=> {
    const bounds = new window.google.maps.LatLngBounds(center)
     
    setMap(mapInst)
  } ,[]);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={styles}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    ></GoogleMap>
  ) : null;
};

export default GMap;
