import React, { useState } from "react";
import {css} from "@emotion/css";
import {motion} from "framer-motion";
import {Dialog} from "./components/Dialog";

function App() {
    const newDate = new Date();
    const [datehour,setDateHour] = useState({
        jour: newDate.getDate(),
        mois: newDate.getMonth(),
        année: newDate.getFullYear(),
        heure: newDate.getHours(),
        minutes: newDate.getMinutes(),
        seconds: newDate.getSeconds(),
    });
    setInterval(()=>{
        setDateHour({
            ...datehour,
            heure: new Date().getHours(),
            minutes: new Date().getMinutes(),
            seconds: new Date().getSeconds(),
        });
    },1000)
    return (
        <>
            <div
                className={css({
                    flexDirection: "row",
                    display: "flex",
                    height: "100vh",
                    justifyContent: "space-between",
                    alignItems: "center",
                })}
            >
                <div
                    className={css({
                        textAlign: "right",
                        width: "50%",
                    })}
                >
                    <motion.h3
                        initial={{ opacity: 0, y: -80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Je suis HAUM votre assistant!!
                    </motion.h3>
                    <p>
                        {datehour.jour}/{datehour.mois}/{datehour.année}
                    </p>
                    <p>
                        {datehour.heure}:{datehour.minutes}:{datehour.seconds}
                    </p>
                </div>
                <div
                    className={css({
                        width: "40%",
                        textAlign: "left",
                    })}
                >
                    <Dialog />
                </div>
            </div>
        </>
    );
}

export default App;
