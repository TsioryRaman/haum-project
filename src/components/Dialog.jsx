import React, { useContext, useRef } from "react";
import { DialogContext } from "../DialogContext";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/css";
import { ActionButton, ActionButtonList } from "./ActionButton.jsx";

const DialogMeteo = ({ children }) => {
    const { city, getMeteo, askForMeteo, closeMeteo, meteoDialog } = useContext(
        DialogContext
    );

    const sinp = useRef(null);

    const searchForMeteo = () => {
        getMeteo(sinp.current.value);
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
                                onClick={() => getMeteo(value)}
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
                        <input type="text" ref={sinp} placeholder="Ville" />
                        <button onClick={searchForMeteo}>Chercher</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export const Dialog = () => {
    const { dialogs, sendRequest, id,loading } = useContext(DialogContext);
    const inp = useRef(null);
    const onClick = (e) => {
        sendRequest(inp.current.value);
        inp.current.value = null;
    };
    return (
        <>
            <AnimatePresence>
                {dialogs.slice(id <= 3 ? 0 : id - 3).map((value) => (
                    <motion.p
                        className={css({
                            width: "600px",
                            margin: "10px 0",
                            fontSize: 32,
                            paddingBottom: 10,
                            textAlign: value.user ? "right" : "left",
                        })}
                        initial={{ opacity: 0, y: "80px" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-80px" }}
                        transition={{ duration: 0.5 }}
                        key={value.id}
                    >
                        {value.msg}
                    </motion.p>
                ))}
                {loading && (
                    <motion.p
                        className={css({
                            width: "600px",
                            margin: "10px 0",
                            fontSize: 32,
                            paddingBottom: 10,
                            textAlign: "left"
                        })}
                        initial={{ opacity: 0, y: "80px" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "-80px" }}
                        transition={{ duration: 0.5 }}
                        key={"i-search"}
                    >
                        Je cherche...
                    </motion.p>
                )}
            </AnimatePresence>
            <div className={css({ margin: 10 })}>
                <input
                    type="text"
                    ref={inp}
                    placeholder="Je voudrais savoir la météo."
                />
                <button onClick={onClick}>Envoyer</button>
            </div>
            <DialogMeteo />
        </>
    );
};
