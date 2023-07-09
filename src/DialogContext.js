import React, { createContext, useState } from "react";
import { getMeteoForCity, getMeteoForCityFake } from "./services/meteo";
import {useSpeechSynthesis} from "react-speech-kit"
export const DialogContext = createContext();

export const DARK = "dark";
export const LIGHT = "light"

const initialState = {
    dialogs: [
        { msg: "En quoi puis-je vous aider aujourd'hui?", id: 0, user: false },
    ],
    city: ["Antananarivo", "Mahajanga", "Paris"],
};
export const DialogProvider = ({ children }) => {
    const [dialogs, setDialogs] = useState(initialState.dialogs);
    const [loading, setLoading] = useState(false);
    const [meteoDialog, setMeteo] = useState(false);
    const {speak} = useSpeechSynthesis();
    const [theme,setTheme] = useState(LIGHT)
    const getMeteo = async (city, msg = "") => {
        console.log("city ", city);
        setLoading(true);
        closeMeteo();

        try {
            const response = await getMeteoForCity(city);
            const data = response.data
            console.log("response", data);
            replyUser(
                `Meteo à ${city}: 
                Température ${Math.floor(data.main.temp)}° C,  ${
                    data.weather[0].description
                }`
            );
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            console.error(error);
            replyUser(
                "Ville non pris en charge pour le moment"
            );
        }
    };
    const switchTheme = (t) => {
        setTheme(t)
        const root = document.querySelector("#root");
        if(t === LIGHT){
            root.classList.remove("vicious_stance")
            root.classList.add("sky_glider")
        }
        if(t === DARK){
            root.classList.remove("premium_white")
            root.classList.add("vicious_stance")
        }
    }
    const askForMeteo = () => {
        setMeteo(true);
    };
    const closeMeteo = () => {
        setMeteo(false);
    };
    const pushMessage = (msg = "", user = true) => {
        setDialogs((prevState)=>[...prevState, { msg, id: prevState.length, user }]);
        
        let element
        if(!element){
            element = document.querySelector("#message")
        }
        console.log(element.scrollTop)
        element.scrollTo({top:element.scrollHeight,behavior:"smooth"})
    };
    const clearMessage = () => {
        setDialogs(initialState.dialogs)
    }
    const sendRequest = (msg = "") => {
        if (msg.length <= 0) return;
        pushMessage(msg);
    };
    const replyUser = (msg = "") => {
        if (msg.length <= 0) return;
        speak({
            text:msg
        })
        pushMessage(msg, false);
    };
    return (
        <DialogContext.Provider
            value={{
                sendRequest,
                id: dialogs.length,
                dialogs,
                city: initialState.city,
                getMeteo,
                meteoDialog,
                askForMeteo,
                replyUser,
                closeMeteo,
                loading,
                switchTheme,
                theme,
                clearMessage
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};
