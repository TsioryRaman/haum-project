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
import { Howl } from "howler";

import { getPorts } from "../arduino/arduino";
import { LoadingBluetoothConnection } from "../arduino/LoadingConnection";

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

export const Dialog = ({ onShow, onArtiste }) => {

    const { speak } = useSpeechSynthesis();
    const { dialogs, sendRequest, getMeteo, id, loading, replyUser } = useContext(DialogContext);
    const [listen, setListen] = useState(false)
    const [loadBluetooth, setLoadBluetooth] = useState(false);
    const [loadBluetoothError,setLoadBluetoothError] = useState(false)

    const [port,setPort] = useState(null);
    const inp = useRef(null);
    const onClick = (e) => {
        sendRequest(inp.current.value);
        if (!inp.current.value) {
            replyUser("Dites quelque chose !")
        } else {
            setTimeout(function () {
                replyUser('vous avez ecris ' + inp.current.value)
                inp.current.value = null
            }, 1000
            )
        }

    };

    const commands = [
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
            command: ["raconte-moi * blague","une blague (s'il te plait)"],
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
            command: "(l')album de * (s'il te plait)",
            callback: (standard) => {
                const indexDe = standard.indexOf('de')
                const artiste = standard.slice(indexDe + 1)

                onArtiste(artiste)

                onShow(x => !x)


            }
        },
        {
            command: "comment vas-tu",
            callback: () => {
                const reponse = ["Je vais bien ...", "Pas mal", "Un bon chocolat chaud me fera du bien ", "il fait froid mais bon ...", "Je suis en pleine forme", "ca va comme tous les jours", "il fait tres tres froid aujourd'hui"]
                const rand = Math.floor(Math.random() * reponse.length)
                replyUser(reponse[rand])
            }
        },
        {
            command: ["au revoir (Rocco)", "A bientot (Rocco)"],
            callback: async () => {
                await SpeechRecognition.stopListening()
                const reponse = ["A bientot", "Au revoir et bonne journee", "Au revoir et sois sage", "On se dit a bientot", "bye bye et a plus tard "]
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('100'));
                writer.releaseLock();

                const rand = Math.floor(Math.random() * reponse.length)
                replyUser(reponse[rand])
                setListen(false)
                
                await port.close()
            }
        },
        {
            command: ["Bonjour (Rocco)","Salut (Rocco)","Hello (Rocco)","Rocco (Rocco)"],
            callback: () => {
                const reponse = ["Salutation ", "Bonjour , content de vous revoir", "Bonjour Je suis votre Robot assistante "]
                const rand = Math.floor(Math.random() * reponse.length)
                replyUser(reponse[rand])
            }
        },
        {
            command: "* la musique",
            callback: async () => {
                const url = 'https://spotify23.p.rapidapi.com/tracks/?ids=4WNcduiCmDNfmTEz7JvmLv';
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': 'cdd5c921b2mshd17a687b801af2dp1b17c1jsn8dc4709b9df0',
                        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
                    }
                };

                try {
                    const response = await fetch(url, options);
                    const result = await response.json();
                    const titre = "titre de la musique :" + result.tracks[0].name

                    replyUser(titre)
                    const src = result.tracks[0].preview_url
                    // const src = "../assets/music.mp3"
                    console.log(result.tracks[0].preview_url)
                    const sound = new Howl({
                        src,
                        html5: true
                    })
                    setTimeout(() => {
                        sound.play()

                    }, 5000)
                    setTimeout(() => {
                        sound.pause()

                    }, 10000)

                    console.log("voici la musique :", result);
                } catch (error) {
                    console.error(error);
                }
            }
        },
        {
            command: ["Avancer","en français"],
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('1'));
                speak({ text: "J'avance maitre" })
                writer.releaseLock();
            }
        },
        {
            command: ["* l'obstacle","contourne (l'obstacle)","Esquive (Rocco)"],
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('2'));
                speak({ text: "Je contourne l'obstacle" })
                writer.releaseLock();


            }
        },
        {
            command: ["Stop *","Stop (Rocco)","stoppe","top"],
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('100'));
                speak({ text: "D'accord maitre, je m'arrete" })
                writer.releaseLock();


            }
        },
        {
            command: ["recule *","recule (Rocco)","reculer"],
            callback: async () => {
                const writer = await port.writable.getWriter();

                let enc = new TextEncoder();
                await writer.write(enc.encode('4'));
                speak({ text: "D'accord maitre, je recule" })
                writer.releaseLock();

            }
        }
    ];
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) { console.log("browser is not supporting") }
    const { resetTranscript, listening, finalTranscript } = useSpeechRecognition({
        language: "fr-FR",
        commands
    })
    const ecouter =async () => {
        setListen(false)
        SpeechRecognition.stopListening()
        setLoadBluetoothError(false)
        if(!port){
            let p = await getPorts(setLoadBluetooth);
            if(p){
                console.log("Bluetooth OK")
                setPort(p)
                setLoadBluetooth(false)
                SpeechRecognition.startListening({ language: "fr-FR",continuous:true });
            }else{
                console.log("Bluetooth non OK")
                setLoadBluetoothError(true)
                setTimeout(function(){
                    setLoadBluetooth(false)
                    SpeechRecognition.startListening({ language: "fr-FR",continuous:true });
                },2000)
            }
        }
    }
    const stopListen = () => {
        setListen(false)
        SpeechRecognition.stopListening()
    }
    useEffect(() => {
        sendRequest(finalTranscript);
        resetTranscript()
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
                {listening && <Msg key={"im-listening"} user={false}>Je vous écoute</Msg>}
                {loading && <Msg key={"im-searching"} user={false}>Je cherche...</Msg>}
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
                    <LoadingBluetoothConnection show={loadBluetooth} error={loadBluetoothError} setLoadBluetooth={setLoadBluetooth}/>
                </div>
            </div>
            <DialogMeteo />
        </>
    );
};
