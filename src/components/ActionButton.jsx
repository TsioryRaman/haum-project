import {motion} from "framer-motion";
import {css} from "@emotion/css";
import React from "react";
import {fadeInUp, stagger} from "./animation";

export function ActionButton({children, onClick}) {
    return <motion.button
        onClick={onClick}
        variants={fadeInUp}
        className={"btn btn-block btn-dark"}
        style={{padding:"12px"}}
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