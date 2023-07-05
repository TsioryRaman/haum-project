import React, { useContext, useEffect, useRef, useState } from "react";
import { DialogContext } from "../DialogContext";
import { AnimatePresence, motion } from "framer-motion";
import { css } from "@emotion/css";
import DialogMeteo from "./DialogMeteo";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";

import { useSpeechSynthesis } from "react-speech-kit"
import BlaguesAPI from 'blagues-api';

import { getPorts } from "../arduino/arduino";

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

    const { speak } = useSpeechSynthesis();
    const { dialogs, sendRequest, getMeteo, id, loading, replyUser } = useContext(DialogContext);
    const [listen, setListen] = useState(false)
    
    const [port,setPort] = useState();
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
            command: "* météo * *",
            callback: (mot, pronom, city, { command, finalTranscript }) => {
                getMeteo(city);
                console.log('command', command)
            },
        },
        {
            command: "raconte-moi * blague",
            callback: async () => {
                const blague = new BlaguesAPI("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODMxODYzMzA5MzcxNTcyMjQ1IiwibGltaXQiOjEwMCwia2V5IjoiSXNyVU5MOHR3WnhhNjBkTmJRUmxwU2UxZVlSbHNNcWdsdEpVV21tNzRVcWRJME50MHgiLCJjcmVhdGVkX2F0IjoiMjAyMy0wNy0wM1QxMjoyNDo0NiswMDowMCIsImlhdCI6MTY4ODM4NzA4Nn0.XDkCGavETYKlXCo3UaJbclqFAVh0VOdD2qmSY9tXzfw");

                const d = await blague.random({
                    disallow: [
                        blague.categories.DARK,
                        blague.categories.LIMIT
                    ]
                })
                speak({ text: d.joke })

                speak({ text: d.answer })
            }
        },
        {
            command: "Avancer",
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('1'));
                speak({ text: "J'avance maitre" })
                
                writer.releaseLock();
            }
        },
        
        {
            command: "* l'obstacle",
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('2'));
                speak({ text: "Je contourne l'obstacle" })
                
                writer.releaseLock();


            }
        },
        {
            command: "Stop *",
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('100'));
                speak({ text: "D'accord maitre, je m'arrete" })
                
                
                writer.releaseLock();

            }
        }
    ];
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) { console.log("browser is not supporting") }
    const { transcript, listening, finalTranscript } = useSpeechRecognition({
        language: "fr-FR",
        commands
    })
    const ecouter = async () => {
        if(!port){
            let p = await getPorts();
            setPort(p);
        }
        await SpeechRecognition.startListening({ language: "fr-FR" });
    }
    const stopListen = () => {
        setListen(false)
        SpeechRecognition.stopListening()
    }
    useEffect(() => {
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
                            onClick={ecouter}
                        >
                            Ecouter
                        </button>
                        <button className={" col-sm-4 mb-4 mt-2 btn btn-danger btn-block"}
                            onClick={stopListen}
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
