import React, { useContext, useRef } from "react";
import { DialogContext } from "../DialogContext";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/css";
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
        getMeteo();
        closeMeteo();
    };
    return (
        <>
            <ActionButtonList>
                {!meteoDialog ? (
                    <ActionButton onClick={askForMeteo}>
                        Search for meteo
                    </ActionButton>
                ) : (
                    <ActionButton onClick={closeMeteo}>
                        Close meteo
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
                            type="text"
                            ref={sinp}
                            placeholder="Ville (Nom d'origine ex:Antananrivo,London,Toamasina) "
                        />
                        <button onClick={searchForMeteo}>Chercher</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DialogMeteo;
