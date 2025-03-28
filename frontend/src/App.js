import React, { useCallback, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";

import "./App.css";
import Users from "./user/pages/Users.js";
import NewPlace from "./places/pages/NewPlace.js";
import MainNavigation from "../src/shared/components/Navigation/MainNavigation.js";
import UserPlaces from "./places/pages/UserPlaces.js";
import UpdatePlace from "./places/pages/Updateplace.js";
import Auth from "./user/pages/Auth.js";
import { AuthContext } from "./context/AuthContext.js";

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [userId, setuserId] = useState(null);
  let routes;

  const login = useCallback((user_id, token, expiration) => {
    setToken(token);
    const future = new Date(new Date().getTime() + 1000 * 60 * 60);
    const tokenExpirationDate = expiration || future;
    setExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        user_id,
        token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setuserId(user_id);
    console.log("Logging in");
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setExpirationDate(null);
    setuserId(null);
    localStorage.removeItem("userData");
    console.log("Logging out");
  }, []);

  useEffect(() => {
    if (token && expirationDate) {
      const reaminingTime = expirationDate - new Date().getTime();
      logoutTimer = setTimeout(logout, reaminingTime);
      console.log("setting timeout here : infinite loop 1");
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      console.log("Calling log in here ,infinite loop 2");

      login(
        storedData.user_id,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/:userId/places" exact element={<UserPlaces />} />
        <Route path="/places/new" exact element={<NewPlace />} />
        <Route path="/places/:pid" element={<UpdatePlace />} />
        <Route path="/user" element={<Users />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/:userId/places" exact element={<UserPlaces />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        userId: userId,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
