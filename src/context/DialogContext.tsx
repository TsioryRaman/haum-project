import {
    FunctionComponent,
    PropsWithChildren,
    createContext,
    useState,
} from "react";
import { getMeteoForCity } from "../services/meteo";
import { useSpeechSynthesis } from "react-speech-kit";
export const DialogContext = createContext<any>(null);

export type DialogType = {
    msg: string;
    id: number;
    user: boolean;
};

type DialogsType = {
    dialogs: DialogType[];
    city: string[];
};

const initialState = {
    dialogs: [
        { msg: "En quoi puis-je vous aider aujourd'hui?", id: 0, user: false },
    ],
    city: ["Antananarivo", "Mahajanga", "Paris"],
};
export const DialogProvider: FunctionComponent<PropsWithChildren<any>> = ({
    children,
}) => {
    const [dialogs, setDialogs] = useState(initialState.dialogs);
    const [loading, setLoading] = useState(false);
    const [meteoDialog, setMeteo] = useState(false);
    const { speak } = useSpeechSynthesis();
    const getMeteo = async (city:string, msg = "") => {
        console.log("city ", city);
        setLoading(true);
        closeMeteo();

        try {
            const response = await getMeteoForCity(city);
            const data = response.data;
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
            replyUser("Ville non pris en charge pour le moment");
        }
    };

    const askForMeteo = () => {
        setMeteo(true);
    };
    const closeMeteo = () => {
        setMeteo(false);
    };
    const pushMessage = (msg = "", user = true) => {
        setDialogs((prevState) => [
            ...prevState,
            { msg, id: prevState.length, user },
        ]);

        let element;
        if (!element) {
            element = document.querySelector("#message");
        }
        if(element!==null){
            element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
        }
    };
    const clearMessage = () => {
        setDialogs(initialState.dialogs);
    };
    const sendRequest = (msg = "") => {
        if (msg.length <= 0) return;
        pushMessage(msg);
    };
    const replyUser = (msg = "") => {
        if (msg.length <= 0) return;
        speak({
            text: msg,
        });
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
                clearMessage,
            }}
        >
            {children}
        </DialogContext.Provider>
    );
};
