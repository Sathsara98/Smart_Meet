import React from "react";
import "./App.css";
import { Navbar } from "./components";
import HomePage from "./components/Home/Index";
import AddQuestion from "./components/Admin/Index";
import ManageMembers from "./pages/ManageMembers";
import ViewMembers from "./pages/ViewMembers";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        {/* <Route path="/sp/:id">
              <NavBar />
              <SingleProduct />
            </Route> */}
        {/* <Route path="/sp/:id" component={SingleProduct} /> */}
        <Route path="/addmembers">
          <Navbar />
          <ManageMembers />
        </Route>
        <Route path="/members">
          <Navbar />
          <ViewMembers />
        </Route>
        <Route path="/addquestion">
          <Navbar />
          <AddQuestion />
        </Route>
        <Route path="/login">
          <Navbar />
          {/* <Login /> */}
        </Route>
        {/* <Route
          path="/logout"
          render={() => {
            Auth.logout();
            return (
              <Wrapper>
                <NavBar /> <Home />
              </Wrapper>
            );
          }}
        /> */}

        {/* <PrivateRoute
              path="/StoreManagerPage"
              component={StoreManagerPage}
              role="sm"
            /> */}

        <Route path="/home">
          <Navbar />
          <HomePage />
        </Route>
        <Route path="*">
          <Navbar />
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
