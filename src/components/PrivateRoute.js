// PrivateRoute is a wrapper around normal React Router routes.
// It checks if the user is logged in before showing a page.
// If the user is not logged in, it sends them to the login page.
import React from "react";
import Auth from "../authentication/Auth";
import { Redirect, Route } from "react-router-dom";
import Wrapper from "../Hoc/Wrapper";

const PrivateRoute = ({ component: Component, role, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      // Check whether the user has a valid login token.
      const loggedIn = Auth.isAuthenticated();
      if (!loggedIn) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }

      // check if route is restricted by role
      //   if (Auth.getUserLevel() !== 'admin') {
      //     if (role == 'admin' && Auth.getUserLevel() !== "admin") {
      //       return <Redirect to={{ pathname: "/Home" }} />;
      //     } else if (role == 'sm' && Auth.getUserLevel() !== "sm") {
      //       return <Redirect to={{ pathname: "/Home" }} />;
      //     }
      //   }

      // authorised so return component
      return (
        <Wrapper>
          <Component {...props} />
        </Wrapper>
      );
    }}
  />
);
export default PrivateRoute;
