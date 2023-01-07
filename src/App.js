import "./App.css";
import Component from "./Component";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div>
      <h2>Welcome....</h2>
      <Switch>
        <Route path="/list">
          <Component />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
