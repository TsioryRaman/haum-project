import React, { useContext, useRef } from "react";
import { DialogContext } from "../DialogContext";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/css";
import "bootstrap/dist/css/bootstrap.min.css"
import { ActionButton, ActionButtonList } from "./ActionButton.jsx";

const DialogMeteo = ({ children }) => {
    const {
        city,
        getMeteo,
        askForMeteo,
        closeMeteo,
        meteoDialog,
        sendRequest,
    } = useContext(DialogContext);

    const sinp = useRef(null);

    const searchForMeteo = () => {
        const city = sinp.current.value;
        getMeteo(city);
        closeMeteo();
    };
    return (
        <>
            <ActionButtonList>
                {!meteoDialog ? (
                    <ActionButton onClick={askForMeteo}>
                        Chercher la m&eacute;t&eacute;o à ...
                    </ActionButton>
                ) : (
                    <ActionButton onClick={closeMeteo}>
                        Fermer la m&eacute;t&eacute;o
                    </ActionButton>
                )}
            </ActionButtonList>
            <AnimatePresence>
                <ActionButtonList>
                    {meteoDialog &&
                        city.map((value, index) => (
                            <ActionButton
                                key={"meteo-city-" + index}
                                onClick={() => {
                                    sendRequest(
                                        `Je voudrais savoir la météo à ${value}`
                                    );
                                    getMeteo(value);
                                }}
                            >
                                {value}
                            </ActionButton>
                        ))}
                </ActionButtonList>
                {meteoDialog && (
                    <motion.div
                        exit={{ opacity: 0, x: -30 }}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={"input-city"}
                        className={css({ margin: 10 })}
                    >
                        <input
                            className={"form-control"}
                            type="text"
                            ref={sinp}
                            placeholder="Ville (Nom d'origine ex:Antananrivo,London,Toamasina) "
                        />
                        <button className={"btn btn-info mt-3"} onClick={searchForMeteo}>Chercher</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DialogMeteo;
