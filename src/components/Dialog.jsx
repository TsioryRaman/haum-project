import React, { useContext, useEffect, useRef, useState } from "react";
import { DARK, DialogContext, LIGHT } from "../DialogContext";
import { motion } from "framer-motion";
import { css } from "@emotion/css";
import DialogMeteo from "./DialogMeteo";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit"
import BlaguesAPI from 'blagues-api';
import { Howl } from "howler";
import { getPorts, sendRoccoData } from "../arduino/arduino";
import { LoadingBluetoothConnection } from "../arduino/LoadingConnection";
// Icone
import { Mic,MicOff,Send,Radio } from "react-feather";
import { ManualControl } from "./ManualControl";
// Mot dite par l'utilisateur et repondu par la machine
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
    const { dialogs, sendRequest, getMeteo, id, loading, replyUser,switchTheme,theme,clearMessage } = useContext(DialogContext);
    const [listen, setListen] = useState(false)
    const [loadBluetooth, setLoadBluetooth] = useState(false);
    const [loadBluetoothError,setLoadBluetoothError] = useState(false)

    const [port,setPort] = useState(null);
    const inp = useRef(null);
    const onClick = async (e) => {
        e.preventDefault()
        // sendRequest(inp.current.value);
        switch(inp.current.value){
            case '1':
                await sendRoccoData(port,'1',"D'accord maitre, J'avance",replyUser)
                break
            case '2':
                await sendRoccoData(port,'2',"D'accord maitre, Je contourne l'obstacle",replyUser)
                break

            case '4':
                await sendRoccoData(port,'4',"D'accord maitre, je recule",replyUser)
                break

            case '100':
                await sendRoccoData(port,'100',"D'accord maitre, je m'arrete",replyUser)
                break

        }
    };

    const commands = [
        {
            command: "*",
            callback: ({command}) => {

            }
        },
        {
            command: ["Bonjour (Rocco)","Salut (Rocco)","Hello (Rocco)","Rocco (Rocco)","Hi (Rocco)"],
            callback: () => {
                const reponse = ["Salutation ", "Bonjour , content de vous revoir", "Bonjour, en quoi puis-je vous etre utile maitre?"]
                replyUser(reponse[Math.floor(Math.random() * reponse.length)])
            }
        },
        {
            command: ["Donne-moi * météo * *"],
            callback: (mot, pronom, city, { command, finalTranscript }) => {
                getMeteo(city);
            },
        },

        {
            command: ["raconte-moi * blague","une blague (s'il te plait)"],
            callback: async () => {
                try{
                    const blague = new BlaguesAPI("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODMxODYzMzA5MzcxNTcyMjQ1IiwibGltaXQiOjEwMCwia2V5IjoiSXNyVU5MOHR3WnhhNjBkTmJRUmxwU2UxZVlSbHNNcWdsdEpVV21tNzRVcWRJME50MHgiLCJjcmVhdGVkX2F0IjoiMjAyMy0wNy0wM1QxMjoyNDo0NiswMDowMCIsImlhdCI6MTY4ODM4NzA4Nn0.XDkCGavETYKlXCo3UaJbclqFAVh0VOdD2qmSY9tXzfw");
                    const d = await blague.random({
                        disallow: [
                            blague.categories.DARK,
                            blague.categories.LIMIT
                        ]
                    })
                    speak({ text: d.joke })
                    speak({ text: d.answer })
                }catch(e){
                    speak({ text: "Desole, je ne retrouve pas de blague pour le moment" })
                }


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
            command: ["au revoir (Rocco)", "A bientot (Rocco)","Deconnecte-toi"],
            callback: async () => {
                try{
                    await SpeechRecognition.stopListening()
                    const reponse = ["A bientot", "Au revoir et bonne journee", "Au revoir et sois sage", "On se dit a bientot", "bye bye et a plus tard "]
                    if(port){
                        const writer = await port.writable.getWriter();
    
                        let enc = new TextEncoder();
                        await writer.write(enc.encode('100'));
                        writer.releaseLock();
                        await port.close()
                        replyUser("Rocco déconnécté")
                    }
    
                    const rand = Math.floor(Math.random() * reponse.length)
                    replyUser(reponse[rand])
                    setListen(false)
                    setPort(null)
                    setTimeout(function(){
                    clearMessage()
                    },2000)
                }catch(e){

                }
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
            command: ["Avancer","en français","Avance"],
            callback: () => {
                sendRoccoData(port,'1',"D'accord maitre, J'avance",replyUser)
            }
        },
        {
            command: ["* l'obstacle","contourne (l'obstacle)","Esquive (Rocco)"],
            callback: () => {
                sendRoccoData(port,'2',"D'accord maitre, Je contourne l'obstacle",replyUser)
            }
        },
        {
            command: ["Stop *","Stop (Rocco)","stoppe","top"],
            callback: () => {
                sendRoccoData(port,'100',"D'accord maitre, je m'arrete",replyUser)
            }
        },
        {
            command: ["recule *","recule (Rocco)","reculer"],
            callback: () => {
                sendRoccoData(port,'4',"D'accord maitre, je recule",replyUser)
            }
        },
        {
            command: ["Change * thème"],
            callback: () => {
                speak({text:`Changement de theme en ${theme === DARK ? "jour" : "nuit"}`})
                theme === DARK ? switchTheme(LIGHT) : switchTheme(DARK)
            }
        }
    ];

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) { 
        speak({text:"Votre appareil ne supporte pas la reconnaissance vocale, veuillez reesayer avec un autre appareil"}) 
    }
    const { resetTranscript, listening, finalTranscript } = useSpeechRecognition({
        language: "fr-FR",
        commands
    })

    // Deconnecte ROCCO
    const exitRoccoConnection = async () => {
        if(port){
            const writer = await port.writable.getWriter();

            let enc = new TextEncoder();
            await writer.write(enc.encode('100'));
            writer.releaseLock();
            await port.close()
        }
    }

    const ecouter =async () => {
        setListen(false)
        SpeechRecognition.stopListening()
        setLoadBluetoothError(false)
        await enablePort();
        setListen(true)
    }

    const enablePort = async () => {
        if(!port){
            let p = await getPorts(setLoadBluetooth,speak);
            if(p){
                console.log("Bluetooth OK")
                setPort(p)
                setLoadBluetooth(false)
                speak({text:"Rocco connecter avec succes"})
                SpeechRecognition.startListening({ language: "fr-FR",continuous:true });
            }else{
                console.log("Bluetooth non OK")
                setLoadBluetoothError(true)
                setTimeout(function(){
                    setLoadBluetooth(false)
                    speak({text:"Erreur de connexion avec Rocco"})
                    SpeechRecognition.startListening({ language: "fr-FR",continuous:true });
                },2000)
            }
        }
        if(port){
            port.addEventListener("disconnect", (event) => {
                // notify that the port has become unavailable
                speak({text:"Rocco s'est deconécté; veuillew le reconecter pour lùutiliser de nouvequ"})
                setPort(null)
            });
        }

    }

    const stopListen = () => {
        setListen(false)
        exitRoccoConnection()
        replyUser("Rocco déconnécté")
        SpeechRecognition.stopListening()
        setTimeout(function(){
            clearMessage()
            },2000)
    }
    useEffect(() => {
        sendRequest(finalTranscript);
        resetTranscript();

        // return function(){
        //     if(port){port.close()}
        // }
    }, [finalTranscript])
    return (
        <>
        
        <motion.div
            id="message"
            className={css({
                minHeight: "15rem",
                maxHeight: "15rem",
                overflowY:"scroll",
                scrollbarWidth:"none",
                
            })}>
                
                {dialogs.slice(id < 4 ? 0 : id - 3).map((value) => (

                    <motion.p
                        className={css({
                            margin: "10px 0",
                            fontSize: 32,
                            paddingBottom: 10,
                            textAlign: value.user ? "right" : "left",
                        })}
                        key={value.id}
                    >
                        {value.msg}
                    </motion.p>
                ))}
                {loading && <Msg key={"im-searching"} user={false}>Je cherche...</Msg>}
            
            </motion.div>
            {listening && <div className="d-flex justify-content-center flex-row mb-4">
                <Mic size="2rem"/>
                <Radio size="2rem" />
                </div>}
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
                        >Envoyer <Send size="1rem" /></button>
                        <button
                            className={"col-sm-4 mb-4 mt-2 btn btn-outline-info btn-block"}
                            style={{ borderRadius: "0" }}
                            onClick={ecouter}
                            disabled={listen}
                        >
                            Ecouter <Mic color="cyan" size="1rem"/>
                        </button>
                        <button className={" col-sm-4 mb-4 mt-2 btn btn-danger btn-block"}

                            disabled={!listen}
                            onClick={stopListen}
                            style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
                        >
                            Arreter <MicOff size="1rem" />
                        </button>
                    </div>
                    <LoadingBluetoothConnection show={loadBluetooth} error={loadBluetoothError} setLoadBluetooth={setLoadBluetooth}/>
                </div>
            </div>
            <DialogMeteo />
            {port && <ManualControl port={port}/>}
        </>
    );
};
