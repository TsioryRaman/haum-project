import {motion} from "framer-motion";
import {css} from "@emotion/css";
import React from "react";
import {fadeInUp, stagger} from "./animation";

export function ActionButton({children, onClick}) {
    return <motion.button
        onClick={onClick}
        variants={fadeInUp}
        className={css({
            margin: 2,
            border: "solid white 1px",
            color: "white",
            backgroundColor: "rgba(111,134,214,0.68)",
            padding: 10,
            borderRadius: 13,
            fontSize: 32,
            ":hover": {
                backgroundColor: "#6f86d6",
            }
        })}
    >
        {children}
    </motion.button>
}

export function ActionButtonList({children}) {
    return <motion.div
        variants={stagger}
        initial={"hide"}
        animate={"show"}
        exit={"exit"}
        className={css({display: "flex", flexDirection: "row", justifyContent: "center", margin: "10px 0"})}
    >
        {children}
    </motion.div>
}