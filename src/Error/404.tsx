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
                <Lottie height={900} width={750} options={defaultOptions} />
    )
}