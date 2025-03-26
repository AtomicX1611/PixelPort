import React, { useCallback, useContext, useEffect, useState } from "react";
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
import Logout from "./shared/components/Navigation/Logout.js";


let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [expirationDate,setExpirationDate] = useState(null)
  const [userId, setuserId] = useState(null);
  let routes;

  const login = useCallback((user_id, token,expiration) => {
    setToken(token);
    const tokenExpirationDate = expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId,
        token,
        expiration : tokenExpirationDate.toISOString
      })
    );
    setuserId(user_id);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setExpirationDate(null)
    setuserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if(token && expirationDate){
      const reaminingTime = expirationDate.getTime() - new Date()
      logoutTimer = setTimeout(logout,reaminingTime)
    }else{
      clearTimeout(logoutTimer)
    }
  },[token,Logout,expirationDate])

  useEffect(() => {
    const storedData = localStorage.getItem("uesrData");
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token,new Date(storedData.expiration));
    }
  }, [login,token,expirationDate]);

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
