import { createContext, useState } from "react";
import { usePost } from "../hook/usePost";
import { HTTP_METHOD } from "../api";

export const UserContext = createContext()

const checkLocalStorage = () => {
    if(localStorage.getItem("user")){
        return {...JSON.parse(localStorage.getItem("user")),isAuthenticated:true}
    }
    return {isAuthenticated:false}
}

export const UserContextProvider = ({children}) => {
    // const navigate = useNavigate()
    const [data,loadData] = usePost()
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

    const login = async (username,password) => {
        try{
            await loadData("http://localhost:3000/auth/login",HTTP_METHOD.POST,{username,password})
            if(data.status === 200){
                await loadData("http://localhost:3000/user/1",HTTP_METHOD.GET)
                if(data) setUser({...data,isAuthenticated:true})
            }
        }catch(error){

            console.error("error:",error)
            throw error
        }
    }
    return (
        <UserContext.Provider value={{user:user,setUser:updateUser,logout:logout,login:login}}>
            {children}
        </UserContext.Provider>
    )
}