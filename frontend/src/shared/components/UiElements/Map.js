import React from "react";
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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCTwWaMfZKWY3BSd6h62gVR0mAyJFJRQxY",
    id: "google-map-script",
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={styles}
      center={center}
      zoom={10}
    />
  ) : null;
};

export default GMap;
