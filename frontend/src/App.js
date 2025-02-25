import React, { useCallback, useContext, useState } from "react";
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

const App = () => {
  const [isLoggedIn, setisLogin] = useState(false);
  let routes;

  const login = useCallback(() => {
    setisLogin(true);
  }, []);

  const logout = useCallback(() => {
    setisLogin(false);
  }, []);

  if (isLoggedIn) {
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
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>{routes}</main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
