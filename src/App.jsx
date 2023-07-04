import React, { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { Dialog } from "./components/Dialog";
import Projectinfo from "./components/info/Projectinfo";
import style from "./assets/App.module.css";
import { Settings, ChevronDown, ChevronUp } from 'react-feather';

// 7 SEGMENT
import SevenSegmentDisplay from 'seven-segment-display';

const setTime = number => number < 10 ? "0" + number : number


function App() {
    let newDate = new Date();
    const [info, setInfo] = useState(false)
    const [datehour, setDateHour] = useState({
        jour: newDate.getDate(),
        mois: newDate.getMonth() + 1,
        année: newDate.getFullYear(),
        heure: newDate.getHours(),
        minutes: newDate.getMinutes(),
        seconds: newDate.getSeconds(),
    });

    useLayoutEffect(() => {
        setTimeout(() => {
            newDate = new Date()
            setDateHour({
                jour: setTime(newDate.getDate()),
                mois: setTime(newDate.getMonth() + 1),
                année: setTime(newDate.getFullYear()),
                heure: setTime(newDate.getHours()),
                minutes: setTime(newDate.getMinutes()),
                seconds: setTime(newDate.getSeconds())
            })
        }, 1000)
    }, [datehour])

    const showInfo = () => { setInfo(i => !i) }

    return (
        <div
            style={{ overflow: "hidden", position: "relative" }}
        >
            <div
                className={"container"}
                style={{ minHeight: "100vh", overflowX: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
            >
                <div>
                    <motion.h3
                        style={{ fontSize: "8em" }}
                        className={"text-white text-center"}

                        initial={{ opacity: 0, y: -80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >R<span className={`${style.rotate}`}><Settings size="0.8em" /></span>C<Settings size="0.8em" /></motion.h3>
                    <div className="row gx-5">

                        <div
                            className={"text-white col-sm-12 col-md-6 "}
                            style={{ marginTop: "80px" }}
                        >
                            <motion.h1
                                style={{ fontSize: "4.5em" }}
                                initial={{ opacity: 0, y: -80 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}

                            >
                                Je suis <span className={"text-info"}>R<Settings size="0.8em" />C<Settings size="0.8em" /></span> votre assistant
                            </motion.h1>
                            <p className={"text-right mt-4"} style={{ fontSize: "3em" }}>
                                {datehour.jour} / {datehour.mois} / {datehour.année}
                            </p>
                            <p className={`text-right mt-4 ${style.digit}`} style={{ height: "100px", fontSize: "3em" }}>
                                <SevenSegmentDisplay color={"red"} digitCount={2} value={datehour.heure} />:<SevenSegmentDisplay color={"red"} value={datehour.minutes} digitCount={2} />:<SevenSegmentDisplay color={"red"} value={datehour.seconds} digitCount={2} />
                            </p>
                            <button className="btn btn-outline-light" onClick={() => showInfo()}>
                                {!info ? "En savoir plus sur nous" : "Fermer"} {!info ? <ChevronDown /> : <ChevronUp />}
                            </button>

                        </div>
                        <div
                            className={"text-white col-sm-12 col-md-6"}
                            style={{ marginTop: "80px" }}
                        >
                            <Dialog />
                        </div>
                    </div>
                </div>

            </div>

            <Projectinfo showInfo={showInfo} info={info} />
        </div>
    );
}

export default App;
