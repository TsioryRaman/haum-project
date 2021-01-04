import React, { createContext, useState } from "react";
import { getMeteoForCity } from "./services/meteo";

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
    const getMeteo = (city,msg="") => {
        console.log("city ", city);
        setLoading(true);
        closeMeteo();
        getMeteoForCity(city)
            .then((response) => {
                const { data } = response;
                console.log("response", data);
                sendRequest(msg)
                replyUser(`Meteo à ${data.name}: 
                Température ${Math.floor(data.main.temp)}° C,  ${
                    data.weather[0].description
                }
            `);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
        return city;
    };
    const askForMeteo = () => {
        setMeteo(true);
    };
    const closeMeteo = () => {
        setMeteo(false);
    };
    const pushMessage = (msg="",user=true) => {
        setDialogs(dialogs.concat([{ msg, id:dialogs.length, user }]));
    }
    const sendRequest = (msg = "") => {
        if (msg.length <= 0) return;
        pushMessage(msg)
    };
    const replyUser = (msg = "") => {
        if (msg.length <= 0) return;
        pushMessage(msg,false)
    };
    return (
        <DialogContext.Provider
            value={{
                sendRequest,
                id:dialogs.length,
                dialogs,
                city: initialState.city,
                getMeteo,
                meteoDialog,
                askForMeteo,
                closeMeteo,
                loading,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};
