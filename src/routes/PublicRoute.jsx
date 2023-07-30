import React, { useContext, useEffect } from 'react'
import {Navigate, useLocation} from "react-router-dom"
import { UserContext } from '../context/UserContext';

const PublicRoute = ({children}) => {
    const {user} = useContext(UserContext);
    let location = useLocation();

    if(user.isAuthenticated) {
        return <Navigate to="/" state={{ from: location}} replace />
    }
    return children

};

export default PublicRoute;