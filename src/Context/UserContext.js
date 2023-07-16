import { createContext, useState } from "react";

export const UserContext = createContext()

const checkLocalStorage = () => {
    if(localStorage.getItem("user")){
        return {...JSON.parse(localStorage.getItem("user")),isAuthenticated:true}
    }
    return {isAuthenticated:false}
}

export const UserContextProvider = ({children}) => {

    const [user,setUser] = useState(checkLocalStorage())
    const updateUser = (user) => {
        if(user){
            localStorage.setItem("user",JSON.stringify(user))
            setUser(user)
        }
    }
    const logout = () => {
        localStorage.removeItem("user")
        setUser({isAuthenticated:false})
    }
    return (
        <UserContext.Provider value={{user:user,setUser:updateUser,logout:logout}}>
            {children}
        </UserContext.Provider>
    )
}