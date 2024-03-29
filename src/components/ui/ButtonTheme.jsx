import { Button } from "react-bootstrap";
import { useContext } from "react";
import {Moon,Sun} from "react-feather";
import { DARK, LIGHT, ThemeContext } from "../../context/ThemeContext";

export const ButtonTheme = () => {
    const {theme,switchTheme} = useContext(ThemeContext);

    const handleThemeChange = () => {
        theme === DARK ? switchTheme(LIGHT) : switchTheme(DARK)
    }

    const handleVariantChange = () => {
        return theme === DARK ? "outline-warning" : "outline-primary"
    }

    return (
        <div style={{
            position:"absolute",
            top:"2rem",
            right:"1rem"
        }}>
            <Button variant={handleVariantChange()} onClick={handleThemeChange}>{theme === LIGHT ? <Moon color="blue"/>:<Sun color="yellow"/>}</Button>
        </div>
    )

}