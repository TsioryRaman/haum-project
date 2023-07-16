import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Dialog } from "./components/Dialog";
import Projectinfo from "./components/info/Projectinfo";
import style from "./assets/App.module.css";
import { Settings, ChevronRight, ChevronLeft } from "react-feather";
import Lottie from "react-lottie";
import animationData from "./Lotties/143850-cloud-robotics-abstract.json";

// 7 SEGMENT
import SevenSegmentDisplay from "seven-segment-display";
import { Music } from "./components/music";
import { DARK, DialogContext, LIGHT } from "./Context/DialogContext";
import { ButtonTheme } from "./components/ui/ButtonTheme";
import { LogoutButton } from "./components/ui/LogoutButton";
const setTime = (number) => (number < 10 ? "0" + number : number);

function App() {
    const [showModal, setShowModal] = useState(false);
    const [artiste, setArtiste] = useState("");
    let newDate = new Date();
    const [info, setInfo] = useState(false);
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
            newDate = new Date();
            setDateHour({
                jour: setTime(newDate.getDate()),
                mois: setTime(newDate.getMonth() + 1),
                année: setTime(newDate.getFullYear()),
                heure: setTime(newDate.getHours()),
                minutes: setTime(newDate.getMinutes()),
                seconds: setTime(newDate.getSeconds()),
            });
        }, 1000);
    }, [datehour]);

    const showInfo = () => {
        setInfo((i) => !i);
    };
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div style={{ overflow: "hidden", position: "relative" }}>
            <div
                className={"container"}
                style={{
                    minHeight: "100vh",
                    position: "relative",
                    height: "100%",
                    overflowX: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <LogoutButton />
                <ButtonTheme />
                <div>
                    {showModal && (
                        <Music
                            artisteProps={artiste}
                            onClearArtiste={setArtiste}
                            modal={setShowModal}
                        />
                    )}
                    <Lottie options={defaultOptions} height={200} width={200} />
                    <div className="row gx-5">
                        <div
                            className={"col-sm-12 col-md-6 "}
                            style={{ marginTop: "80px" }}
                        >
                            <motion.h1
                                style={{ fontSize: "3em" }}
                                className={"text-right"}
                                initial={{ opacity: 0, y: -80 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                Je suis R
                                <span className={`${style.rotate}`}>
                                    <Settings
                                        size="0.8em"
                                        style={{ marginBottom: "15px" }}
                                    />
                                </span>
                                CC
                                <span className={`${style.rotationInverse}`}>
                                    <Settings
                                        size="0.8em"
                                        style={{ marginBottom: "15px" }}
                                    />
                                </span>{" "}
                                <br />
                                votre assistant
                            </motion.h1>
                            <p
                                className={"text-right mt-4"}
                                style={{ fontSize: "3em" }}
                            >
                                {datehour.jour} / {datehour.mois} /{" "}
                                {datehour.année}
                            </p>
                            <p
                                className={`text-right mt-4 ${style.digit}`}
                                style={{ height: "100px", fontSize: "3em" }}
                            >
                                <SevenSegmentDisplay
                                    color={"red"}
                                    digitCount={2}
                                    value={datehour.heure}
                                />
                                :
                                <SevenSegmentDisplay
                                    color={"red"}
                                    value={datehour.minutes}
                                    digitCount={2}
                                />
                                :
                                <SevenSegmentDisplay
                                    color={"red"}
                                    value={datehour.seconds}
                                    digitCount={2}
                                />
                            </p>
                            <button
                                className="btn btn-outline-light"
                                onClick={() => showInfo()}
                            >
                                {!info ? "En savoir plus sur nous" : "Fermer"}{" "}
                                {!info ? <ChevronRight /> : <ChevronLeft />}
                            </button>
                        </div>
                        <div
                            className={"col-sm-12 col-md-6"}
                            style={{ marginTop: "80px" }}
                        >
                            <Dialog
                                onShow={setShowModal}
                                onArtiste={setArtiste}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Projectinfo showInfo={showInfo} info={info} />
        </div>
    );
}

export default App;
