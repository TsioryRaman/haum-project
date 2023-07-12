import React, { useState } from "react"

import { motion } from "framer-motion"
import { AlertOctagon,Command } from "react-feather"
import { sendRoccoData } from "../arduino/arduino"
import { useSpeechSynthesis } from "react-speech-kit";

const ARROWUP ="ArrowUp"
const ARROWDOWN = "ArrowDown"
const ARROWLEFT = "ArrowLeft"
const ARROWRIGHT = "ArrowRight"
export const ManualControl = ({port}) => {

    const [key,setKey] = useState(null)
    const [activate,setActivate] = useState(false)
    const { speak } = useSpeechSynthesis();

    const handleStop = (e) => {
        e.preventDefault()
        console.log("key up")
        if(port){
            sendRoccoData(port,'100')
            setKey(null)
        }
    }

    const onClick = async (e) => {
        e.preventDefault()
        await setActivate(a=>!a)
        console.log("Mode manuel")
        if(activate){
            speak({text:"Rocco passe en mode manuel"})
        }
    }

    const handleClick = (e,command) => {
        e.preventDefault()
        // if (port){
        //     sendRoccoData(port,command)
        // }
        
        console.log('User pressed: ', e.key);
        console.log("Pressed")
        if(port){
            console.log("Port ok")
            switch(e.key){
                case "ArrowUp":
                    if(key!==ARROWUP){
                        setKey(ARROWUP)
                        sendRoccoData(port,"10")
                        console.log('User pressed: ', e.key);
                    }
                    break
                case "ArrowDown":
                    if(key!==ARROWDOWN){
                        setKey(ARROWDOWN)
                        sendRoccoData(port,'11')
                        console.log('User pressed: ', e.key);
                    }
                    break
                case "ArrowLeft":
                    if(key!==ARROWLEFT){
                        setKey(ARROWLEFT)
                        sendRoccoData(port,'12')
                        console.log('User pressed: ', e.key);
                    }
                    break
                case "ArrowRight":
                    if(key!==ARROWRIGHT){
                        setKey(ARROWRIGHT)
                        sendRoccoData(port,'13')
                        console.log('User pressed: ', e.key);
                    }
                    break
            }
        }
    }

    return (<>
                <motion.button onClick={onClick} className={`btn mx-auto ${activate ? "btn-success" :"btn-danger"}`} onKeyDown={(e)=>{handleClick(e,'10')}} onKeyUp={(e)=>{handleStop(e)}}>{!activate ? "Passer en commande manuel":"Commande manuelle activee"}  <AlertOctagon /><Command /></motion.button>
                </>)
}