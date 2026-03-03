import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import useHttpClient from "../../shared/hooks/http-hook.js";
import LoadingSpinner from "../../shared/components/UiElements/LoadingSpinner.js";
import PageTransition from "../../shared/components/UiElements/PageTransition.js";
import "./UserPlaces.css";

const UserPlaces = () => {
  const userID = useParams().userId;

  const [places, setPlaces] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const { loading, sendRequest } = useHttpClient();

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
  }, [sendRequest, userID]);

  // Try to get user info from the places data or a separate call
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/users?page=1&limit=100`
        );
        const users = response.message || [];
        const user = users.find((u) => u._id === userID);
        if (user) setUserInfo(user);
      } catch (err) {}
    };
    fetchUserInfo();
  }, [sendRequest, userID]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place._id !== deletedPlaceId)
    );
  };

  return (
    <PageTransition>
      <div className="user-places-page">
        {/* Profile Header */}
        <div className="user-places-profile">
          <div className="user-places-profile__inner">
            {userInfo ? (
              <>
                <div className="user-places-profile__avatar">
                  <img
                    src={`http://localhost:5000/${userInfo.image}`}
                    alt={userInfo.name}
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="user-places-profile__info">
                  <h1>{userInfo.name}</h1>
                  <div className="user-places-profile__stats">
                    <span className="user-places-profile__stat">
                      <strong>{places.length}</strong> {places.length === 1 ? "place" : "places"}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="user-places-profile__info">
                <h1>User's Places</h1>
                <div className="user-places-profile__stats">
                  <span className="user-places-profile__stat">
                    <strong>{places.length}</strong> {places.length === 1 ? "place" : "places"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {loading && places.length === 0 ? (
          <div className="user-places-loading">
            <LoadingSpinner />
          </div>
        ) : (
          <PlaceList
            list={places}
            userId={userID}
            onPlaceDeleted={placeDeletedHandler}
          />
        )}
      </div>
    </PageTransition>
  );
};

export default UserPlaces;
