import { createContext, useState } from "react";
import { usePost } from "../hook/usePost";
import { ApiFetch, HTTP_METHOD } from "../api";
import { stopAnimation } from "./ThemeContext";
const checkLocalStorage = () => {
    if (localStorage.getItem("user")) {
        return { ...JSON.parse(localStorage.getItem("user")), isAuthenticated: true }
    }
    return { isAuthenticated: false }
}

export const UserContext = createContext(checkLocalStorage())
export const UserContextProvider = ({ children }) => {
    // const navigate = useNavigate()
    // const [data,loadData] = usePost()
    const [user, setUser] = useState(checkLocalStorage())
    const updateUser = (user) => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
            setUser(user)
        }
    }
    console.log("User in context:",user)
    const logout = () => {
        localStorage.removeItem("user")
        setUser({ isAuthenticated: false })
        stopAnimation()
    }

    const login = async (username, password) => {
        try {
            const response = await ApiFetch("http://localhost:3000/auth/login", HTTP_METHOD.POST, { username, password })
            const data = await response.json()
            if (data.status === 200) {
                const response = await ApiFetch("http://localhost:3000/user/1", HTTP_METHOD.GET)

                updateUser({ ...response, isAuthenticated: true })
            }
        } catch (error) {

            console.error("error:", error)
            throw error
        }
    }

    const signup = async (email, lastname,address,username, password) => {
        try {
            const response = await ApiFetch("http://localhost:3000/user", HTTP_METHOD.POST, { username, password,email, lastname,address})
            console.log(response)
            if(response.ok){
                const data = await response.json()
                await login(data.username,password)
            }

        } catch (error) {

            console.error("error:", error)
            throw error
        }
    }
    return (
        <UserContext.Provider value={{ user, setUser: updateUser, logout, login,signup }}>
            {children}
        </UserContext.Provider>
    )
}