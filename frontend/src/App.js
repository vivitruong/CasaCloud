import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import { useDispatch } from "react-redux";
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import  AllSpots  from "./components/Spots";
import { FilterSpotsPage } from "./components/Spots/FilterSpots";
import { CreateSpots } from './components/CreateSpots/CreateSpot'
import { SpotDetail } from "./components/SpotDetail/SpotDetail";
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
        <Route exact path='/'>
          <AllSpots />
        </Route>
        <Route path='/spots/new'>
              <CreateSpots />
            </Route>
        <Route path='/spots/:spotId'>
              <SpotDetail />
          </Route>
        <Route exact path="/login">
          <LoginFormPage />
        </Route>
        <Route exact path="/signup">
          <SignupFormPage />
        </Route>
        <Route exact path='/filtered-spots'>
          <FilterSpotsPage/>
          </Route>



      </Switch>
    )}
    </div>
  );
}

export default App;
