import { Button } from "react-bootstrap";
import { useContext } from "react";
import {LogOut} from "react-feather";
import { UserContext } from "../../Context/UserContext";

export const LogoutButton = () => {
    const {logout} = useContext(UserContext)

    return (
        <div style={{
            position:"absolute",
            top:"2rem",
            right:"5rem"
        }}>
            <Button variant="outline-warning" onClick={logout}><LogOut /></Button>
        </div>
    )

}