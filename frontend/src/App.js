import React from 'react';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/" exact render={(props) => (<LandingPage {...props} page={"login"} />)} />
          <Route path="/register" exact render={(props) => (<LandingPage {...props} page={"register"} />)} />
          <Route path="/HomePage" exact component={HomePage} />
          <Route
            path="/server_error"
            exact
            render={(props) => (<LandingPage {...props} page={"server_error"} />)}
          />
          <Route
            path="*"
            render={(props) => (<LandingPage {...props} page={"page_not_found"} />)}
          />
        </Switch>
      </BrowserRouter>
  );
}

export default App;
