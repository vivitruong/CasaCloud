import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import { useDispatch } from "react-redux";
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import  AllSpots  from "./components/Spots";
import { FilterSpotsPage } from "./components/Spots/FilterSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);
  return (
    <div className="page-container">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
      <Switch>
        <Route path='/' exact>
          <AllSpots />
        </Route>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
        <Route path='/filtered-spots'>
          <FilterSpotsPage/>
          </Route>

      </Switch>
    )}
    </div>
  );
}

export default App;
