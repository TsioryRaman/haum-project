import {motion} from "framer-motion"
import Lottie from "react-lottie"
import Error404_Lottie from "../lotties/animation_lknvaa78.json"
export const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Error404_Lottie,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};
export const Error404 = () => {
    
    return (
        <motion.div style={{minHeight:"100vh",maxHeight:"100vh",width:"100%",height:"100%"}}>
                <Lottie options={defaultOptions} />
        </motion.div>
    )
}