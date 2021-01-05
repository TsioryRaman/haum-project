import React, { useState, useLayoutEffect } from "react";
import {css} from "@emotion/css";
import {motion} from "framer-motion";
import {Dialog} from "./components/Dialog";
import Projectinfo from "./components/info/Projectinfo";

const setTime =  number => number < 10 ? "0"+number : number


function App() {
    let newDate = new Date();
    const [info,setInfo] = useState(false) 
    const [datehour,setDateHour] = useState({
        jour: newDate.getDate(),
        mois: newDate.getMonth() + 1,
        année: newDate.getFullYear(),
        heure: newDate.getHours(),
        minutes: newDate.getMinutes(),
        seconds: newDate.getSeconds(),
    });

    useLayoutEffect(()=> {
        setTimeout(() => {
            newDate = new Date()
            setDateHour({
                jour: setTime(newDate.getDate()),
                mois: setTime(newDate.getMonth() + 1) ,
                année: setTime(newDate.getFullYear()),
                heure: setTime(newDate.getHours()),
                minutes: setTime(newDate.getMinutes()),
                seconds: setTime(newDate.getSeconds())
            })
        },1000)
    },[datehour])

    const showInfo = () => {setInfo(i => !i)}
    
    return (
        <div style={{display:"flex",flexDirection:"row"}}>
            <div
                className={"container"}
                style={{minHeight: "100vh"}}
            >
                <div className="row">

                    <div
                        className={"text-white col-sm-12 col-md-6 "}
                        style={{marginTop:"80px"}}
                    >
                        <motion.h1
                            style={{fontSize:"4.5em"}}
                            className={"text-right"}
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Je suis <span className={"text-danger"}>HAUM</span> votre assistant
                        </motion.h1>
                        <p className={"text-right mt-4"} style={{fontSize:"3em"}}>
                            {datehour.jour} / {datehour.mois} / {datehour.année}
                        </p>
                        <p className={"text-right mt-4"} style={{fontSize:"3em"}}>
                            {datehour.heure}:{datehour.minutes}:{datehour.seconds}
                        </p>
                        <div className="row">
                            <button className="btn btn-light" onClick={() => showInfo()} style={{marginLeft:"auto"}}>
                                {!info ? "En savoir plus" : "Fermer" }
                            </button>    
                        </div>
                        
                    </div>
                    <div
                        className={"text-white col-sm-12 col-md-6"}
                        style={{marginTop:"80px"}}
                    >
                        <Dialog />
                    </div>
                </div>
            </div>
            <Projectinfo info={info}/>
        </div>
    );
}

export default App;
