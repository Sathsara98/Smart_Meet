import React from "react";
import "./App.css";
import { Navbar } from "./components";
import HomePage from "./components/Home/Index";
import NotAvailable from "./components/NotAvailable/Index";
import AddQuestion from "./components/Questions/Index";
import Minute from "./components/Minute/Index";
import Profile from "./components/Profile/Index";
import ManageMembers from "./pages/ManageMembers";
import ManageEvents from "./pages/ManageEvents";
import ViewMembers from "./pages/ViewMembers";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./components/Dashboard/Index";
import Print from "./components/Print";
import Login from "./pages/Login";
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
          <ManageMembers />
        </Route>
        <Route path="/events">
          <ManageEvents />
        </Route>
        <Route path="/managemembers/:type">
          {/* <Navbar /> */}
          <ViewMembers />
        </Route>
        <Route path="/addquestion">
          <AddQuestion />
        </Route>
        <Route path="/test">
          <Print />
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
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/forget">
          <ForgetPassword />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/minute">
          <Minute />
        </Route>
        <Route path="/notAvailable">
          <NotAvailable />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="*">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
