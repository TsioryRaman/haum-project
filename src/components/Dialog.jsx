import React, { useContext, useEffect, useRef } from "react";
import { DialogContext } from "../DialogContext";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/css";
import DialogMeteo from "./DialogMeteo";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

const Msg = ({ children, user = true }) => {
    return (
        <motion.p
            className={css({
                margin: "10px 0",
                fontSize: 32,
                paddingBottom: 10,
                textAlign: user ? "right" : "left",
            })}
            initial={{ opacity: 0, y: "80px" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-80px" }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.p>
    );
};

export const Dialog = () => {
    const { dialogs, sendRequest, getMeteo, id, loading, replyUser } = useContext(DialogContext);
    const inp = useRef(null);
    const onClick = (e) => {
        sendRequest(inp.current.value);
        if (!inp.current.value) {
            replyUser("Dites quelque chose !")
        } else {
            setTimeout(function () {
                console.log(inp);
                replyUser('vous avez ecris ' + inp.current.value)
            }, 1000
            )
        }

        inp.current.value = null;
    };

    const commands = [
        {
            command: "*",
            callback: (standard) => {
                console.log('standard' + standard);
            }
        },
        {
            command: "Salut",
            callback: ({ command }) => {
                console.log('command', command)
            },
        },
        {
            command: "Je voudrais savoir la météo * *",
            callback: (pronom, city, { command, finalTranscript }) => {
                getMeteo(city);
                console.log('command', command)
            },
        },
    ];

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) { console.log("browser is not supporting") }


    const { transcript, listening, finalTranscript } = useSpeechRecognition({
        language: "fr-FR",
        commands
    })
    useEffect(() => {
        const msg = finalTranscript;
        console.log('finalTranscript' + finalTranscript)
        sendRequest(finalTranscript);
    }, [finalTranscript])
    return (
        <>
            <AnimatePresence>
                {dialogs.slice(id < 4 ? 0 : id - 3).map((value) => (
                    <motion.p
                        className={css({
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
                {loading && <Msg key={"im-searching"} user={false}>Je cherche...</Msg>}
                {listening && <Msg key={"im-listening"} user={false}>Je vous écoute</Msg>}
                {listening && <Msg key={"transcripting"}>{transcript}</Msg>}
            </AnimatePresence>
            <div>
                <div className="row">
                    <div className="col-sm-12 mb-2">
                        <input
                            type="text"
                            ref={inp}
                            id={"meteo"}
                            className={"form-control"}
                            placeholder={"Demander de l'aide ..."}
                        />
                    </div>
                    <div className="row no-gutters">
                        <button className={"col-sm-4 mb-4 mt-2 btn btn-success btn-block"}
                            onClick={onClick}
                            style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
                        >Envoyer</button>
                        <button
                            className={"col-sm-4 mb-4 mt-2 btn btn-outline-info btn-block"}
                            style={{ borderRadius: "0" }}
                            onClick={async () => {
                                await SpeechRecognition.startListening({ language: "fr-FR" });
                                console.log("Micros on")
                            }}
                        >
                            Ecouter
                        </button>
                        <button className={" col-sm-4 mb-4 mt-2 btn btn-danger btn-block"}
                            onClick={() => SpeechRecognition.stopListening()}
                            style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                        >
                            Arreter
                        </button>
                    </div>

                </div>
            </div>
            <DialogMeteo />
        </>
    );
};
