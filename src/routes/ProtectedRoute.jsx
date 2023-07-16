import React, { useContext, useEffect } from 'react'
import {Navigate, useLocation} from "react-router-dom"
import { UserContext } from '../Context/UserContext';

const ProtectedRoute = ({children}) => {
    const {user} = useContext(UserContext);
    let location = useLocation();

    if(!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
    return children

};

export default ProtectedRoute;