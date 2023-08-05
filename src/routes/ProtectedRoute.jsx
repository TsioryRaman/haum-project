import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserContext);
    let location = useLocation();

    // if(!user.isAuthenticated) {
    //     return <Navigate to="/login" state={{ from: location}} replace />
    // }
    // return children

    return (
        <>
            {!user.isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
            ) : 
                children
            }
        </>
    );
};

export default ProtectedRoute;
