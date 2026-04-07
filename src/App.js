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
import PrivateRoute from "./components/PrivateRoute";
import MySubmission from "./components/MySubmission/MySubmission";
import Footer from "./components/Footer/Footer";

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
        <Route path="/test">
          <Print />
        </Route>
        {/* <PrivateRoute path="/events/:isOpen?" component={ManageEvents} /> */}
        <PrivateRoute
          path="/events/:isOpen?"
          component={(props) => <ManageEvents {...props} />}
        />
        <PrivateRoute path="/addmembers" component={ManageMembers} />
        <PrivateRoute path="/managemembers/:type" component={ViewMembers} />
        <PrivateRoute path="/addquestion" component={AddQuestion} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/minute" component={Minute} />
        <PrivateRoute path="/notAvailable" component={NotAvailable} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/mysubmission" component={MySubmission} />

        <Route path="/login">
          <Login />
        </Route>
        <Route path="/forget">
          <ForgetPassword />
        </Route>
        {/* <Route path="/dashboard">
          <Dashboard />
        </Route> */}
        <Route path="*">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
