import { useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import style from "../../assets/App.module.css";
import { Settings, ChevronRight, ChevronLeft } from "react-feather";
import Lottie from "react-lottie";
import animationData from "../../lotties/143850-cloud-robotics-abstract.json";
import cityData from "../../lotties/city_animation.json";
import ispm from "../../assets/image/ispm.png";

// 7 SEGMENT
import SevenSegmentDisplay from "seven-segment-display";
import { LogoutButton } from "../../components/ui/LogoutButton";
import { ButtonTheme } from "../../components/ui/ButtonTheme";
import { Music } from "../../components/music";
import { Dialog } from "../../components/Dialog";
import Projectinfo from "../../components/info/Projectinfo";
const setTime = (number: number): number => (number < 10 ? 0 + number : number);

export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};
export const cityOptions = {
    loop: true,
    autoplay: true,
    animationData: cityData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

type DateType = {
    jour: number;
    mois: number;
    année: number;
    heure: number;
    minutes: number;
    seconds: number;
};

function Home() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [artiste, setArtiste] = useState<string | null>("");
    let newDate = new Date();
    const [info, setInfo] = useState<boolean>(false);
    const [datehour, setDateHour] = useState<DateType>({
        jour: newDate.getDate(),
        mois: newDate.getMonth() + 1,
        année: newDate.getFullYear(),
        heure: newDate.getHours(),
        minutes: newDate.getMinutes(),
        seconds: newDate.getSeconds(),
    });

    useLayoutEffect(() => {
        setInterval(() => {
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
    }, []);

    const showInfo = () => {
        setInfo((i) => !i);
    };

    return (
        <motion.div style={{ overflow: "hidden", position: "relative" }}>
            <motion.div
                id="background__theme__anim"
                initial={{ opacity: 0, y: "-100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
            </motion.div>

            <div
                className={"container"}
                style={{
                    minHeight: "100vh",
                    position: "relative",
                    height: "100%",
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
                    <motion.div
                        className="d-flex"
                        initial={{ opacity: 0, y: -80 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Lottie
                            options={defaultOptions}
                            height={200}
                            width={200}
                        />
                    </motion.div>
                    <div className="row gx-5">
                        <img
                            src={ispm}
                            alt="logo__ispm"
                            style={{
                                height: "8.5rem",
                                width: "auto",
                                position: "absolute",
                                top: 40,
                                left: 0,
                                zIndex: 10,
                            }}
                        />

                        <div
                            className={"col-sm-12 col-md-6 "}
                            style={{ marginTop: "80px" }}
                        >
                            <motion.h1
                                style={{ fontSize: "2.5rem",fontFamily:"Jura" }}
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
                                style={{ fontSize: "2.5rem" }}
                            >
                                {datehour.jour} | {datehour.mois} |{" "}
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
        </motion.div>
    );
}

export default Home;
