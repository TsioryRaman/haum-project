import React, { useContext,  useEffect,  useRef } from "react";
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
                width: "600px",
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
    const { dialogs, sendRequest, getMeteo,id, loading,replyUser } = useContext(DialogContext);
    const inp = useRef(null);
    const onClick = (e) => {
        sendRequest(inp.current.value);
        replyUser("hello")
        inp.current.value = null;
    };
    const commands = [
        {
            command: "*",
            callback: (standard) => {
                console.log('standard', standard);
            }
        },
        {
            command: "Salut",
            callback: ({command}) => {
                console.log('command', command)
            },
        },
        {
            command: "Je voudrais savoir la météo * *",
            callback: (pronom,city,{command,finalTranscript}) => {
                getMeteo(city);
                console.log('command', command)
            },
        },
    ];
    if (!SpeechRecognition.browserSupportsSpeechRecognition())
        console.log("browser is not supporting");
    const reco = useSpeechRecognition({
        language: "fr-FR",
        commands,
    });
    const { transcript, listening,finalTranscript } = reco;
    useEffect(()=>{
        const msg =finalTranscript;
        console.log('finalTranscript', finalTranscript)
        sendRequest(finalTranscript);
    },[finalTranscript])
    return (
        <>
            <AnimatePresence>
                {dialogs.slice(id<4?0:id-3).map((value) => (
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
                {loading && <Msg key={"im-searching"} user={false}>Je cherche...</Msg>}
                {listening && <Msg key={"im-listening"} user={false}>Je vous écoute</Msg>}
                {listening && <Msg key={"transcripting"}>{transcript}</Msg>}
            </AnimatePresence>
            <div className={css({ margin: 10 })}>
                <input
                    type="text"
                    ref={inp}
                    placeholder="Je voudrais savoir la météo."
                />
                <button onClick={onClick}>Envoyer</button>
                <button
                    onClick={() => {
                        SpeechRecognition.startListening({ language: "fr-FR" });
                    }}
                >
                    Ecouter
                </button>
                <button onClick={() => SpeechRecognition.stopListening()}>
                    Arreter
                </button>
            </div>
            <DialogMeteo />
        </>
    );
};
