import React, { createContext, useState } from "react";
import { getMeteoForCity, getMeteoForCityFake } from "./services/meteo";

export const DialogContext = createContext();

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
    const getMeteo = async (city, msg = "") => {
        console.log("city ", city);
        setLoading(true);
        closeMeteo();

        try {
            const response = await getMeteoForCityFake(city);
            const data = response;
            console.log("response", data);
            replyUser(
                `Meteo à ${data.name}: 
                Température ${Math.floor(data.main.temp)}° C,  ${
                    data.weather[0].description
                }`
            );
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    const askForMeteo = () => {
        setMeteo(true);
    };
    const closeMeteo = () => {
        setMeteo(false);
    };
    const pushMessage = (msg = "", user = true) => {
        setDialogs((prevState)=>[...prevState, { msg, id: prevState.length, user }]);
    };
    const sendRequest = (msg = "") => {
        if (msg.length <= 0) return;
        pushMessage(msg);
    };
    const replyUser = (msg = "") => {
        if (msg.length <= 0) return;
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
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};
