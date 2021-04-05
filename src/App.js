import NewsUpdates from "./NewsUpdates";
import React from "react";
import Home from "./Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home}></Route>
        <Route path="/newsupdates" component={NewsUpdates}></Route>
      </Switch>
    </Router>
  );
}
export default App;
