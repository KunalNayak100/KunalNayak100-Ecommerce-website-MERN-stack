import React, { Fragment } from "react";
import { Navigate, Route, Routes } from "react-router-dom";


//protected route banane ki approach video vali ni h, 6pp ki nayi video h protectedd route pe vo tarika used hai
const ProtectedRoute = ({children,isAuthenticated,redirect}) => {

   
    // console.log("protected route me gaya");
    // console.log("isAuthenticated",isAuthenticated); 
  
    if (isAuthenticated===false) {
      return <Navigate to={`/login?redirect=${redirect}`} />;
    }
    
    return(
      children
    );


    

    // // true ? <Component /> : <Navigate to="/login" />
    // <Fragment>
    //   {loading === false && (
    //     // <Routes>
    //     <Route
    //       {...rest}
    //       render={(props) => {
    //         if (isAuthenticated === false) {
    //           return <Navigate to="/login" />;
    //         }

    //         // if (isAdmin === true && user.role !== "admin") {
    //         //   return <Navigate to="/login" />;
    //         // }

    //         return <Component {...props} />;
    //       }}
    //     />
    //     // </Routes>
    //   )}
    // </Fragment>
  
};

export default ProtectedRoute;