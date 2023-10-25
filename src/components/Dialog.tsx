import React, { FunctionComponent, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { DialogContext, DialogType } from "../context/DialogContext";
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
import { DARK, LIGHT, startAnimation, ThemeContext } from "../context/ThemeContext";
// Mot dite par l'utilisateur et repondu par la machine
type MsgProps = {
    user:boolean;
}
type DialogProps = {
    onShow: React.Dispatch<React.SetStateAction<boolean>>    ,
    onArtiste: React.Dispatch<React.SetStateAction<string|null>>
}

type MeteoCommandType = {
    mot:string;
    pronom:string;
    city:string;
}
const Msg:FunctionComponent<PropsWithChildren<MsgProps>> = ({children,user = true}) => {
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

export const Dialog:FunctionComponent<DialogProps> = ({ onShow, onArtiste }) => {

    const { speak } = useSpeechSynthesis();
    const { dialogs, sendRequest, getMeteo, id, loading, replyUser,clearMessage } = useContext(DialogContext);
    
    const { switchTheme,theme } = useContext(ThemeContext);
    const [listen, setListen] = useState(false)
    const [loadBluetooth, setLoadBluetooth] = useState(false);
    const [loadBluetoothError,setLoadBluetoothError] = useState(false)

    const [port,setPort] = useState<any>(null);
    const inp = useRef<HTMLInputElement>(null);
    const onClick = () => {
        if(inp.current){
            sendRequest(inp.current.value);
            if (!inp.current.value) {
                replyUser("Dites quelque chose !")
            }
        }
    };

    const commands = [
        {
            command: ["Bonjour (Rocco)","Salut (Rocco)","Hello (Rocco)","Rocco (Rocco)","Hi (Rocco)"],
            callback: () => {
                const reponse = ["Salutation ", "Bonjour , content de vous revoir", "Bonjour, en quoi puis-je vous etre utile maitre?"]
                replyUser(reponse[Math.floor(Math.random() * reponse.length)])
            }
        },
        {
            command: ["Donne-moi * météo * *"],
            callback: ({mot, pronom, city}:MeteoCommandType) => {
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
            callback: (standard:any) => {
                const indexDe = standard.indexOf('de')
                const artiste:string = standard.slice(indexDe + 1)
                if(artiste){onArtiste(artiste)}

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
                        // const writer = await port.writable.getWriter();
                        // let enc = new TextEncoder();
                        // await writer.write(enc.encode('100'));
                        // writer.releaseLock();
                        // await port.close()
                        await exitRoccoConnection()
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
                speak({text:`Changement de theme en ${theme === DARK ? "nuit" : "jour"}`})
                theme === DARK ? switchTheme(LIGHT) : switchTheme(DARK)
            }
        }
    ];

    // if (!SpeechRecognition.browserSupportsSpeechRecognition()) { 
    //     speak({text:"Votre appareil ne supporte pas la reconnaissance vocale, veuillez reesayer avec un autre appareil"}) 
    // }
    const { resetTranscript, listening, finalTranscript } = useSpeechRecognition({
        language: "fr-FR",
        commands
    })

    // Deconnecte ROCCO
    const exitRoccoConnection = async () => {
        try{
            if(port){
                const writer = await port.writable.getWriter();
    
                let enc = new TextEncoder();
                await writer.write(enc.encode('100'));
                writer.releaseLock();
                port.close()
            }
        }catch(e)
        {
            console.log(e)
        }
    }

    const ecouter =async () => {
        setListen(false)
        SpeechRecognition.stopListening()
        setLoadBluetoothError(false)
        try{
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
        }catch(e)
        {
            console.log(e)
        }
        setListen(true)
    }
    const stopListen = async () => {
        setListen(false)
        await exitRoccoConnection()
        replyUser("Rocco déconnécté")
        await SpeechRecognition.stopListening()
        setTimeout(function(){
            clearMessage()
            },2000)
    }
    useEffect(() => {
    startAnimation()
    },[])
    useEffect(() => {
        sendRequest(finalTranscript);
        resetTranscript();

    }, [finalTranscript])
    return (
        <>
        
        <motion.div
            id="message"
            className={css({
                minHeight: "15rem",
                maxHeight: "15rem",
                overflowY:"scroll",
                scrollbarWidth:"none"
            })}>
                {dialogs.slice(id < 4 ? 0 : id - 3).map((value:DialogType) => (

                    <motion.p
                        className={css({
                            margin: "10px 0",
                            fontSize: 32,
                            paddingBottom: 10,
                            textAlign: value.user ? "right" : "left",
                            textShadow: "5px 5px 10px white"
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
                    <div className="9px-sm-12 mb-2">
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
        </>
    );
};
