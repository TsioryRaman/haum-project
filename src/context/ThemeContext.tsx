import {
    FunctionComponent,
    PropsWithChildren,
    createContext,
    useState,
} from "react";

export const DARK = "dark";
export const LIGHT = "light";

const vicious_stance = `linear-gradient(60deg, #29323c 0%, #485563 100%)`
const premium_white = `linear-gradient(to top, #88d3ce 0%, #6e45e2 100%)`

export const ThemeContext = createContext({});


export const startAnimation = () => {

    const element:HTMLElement = document.querySelector("#background__theme__anim")!
    const _leftElemet:HTMLElement = document.querySelector("#background__theme__anim")!
    if(element && _leftElemet){
        _leftElemet.style.width = "50%";
        element.style.display = "block";
        element.animate([
            {background: "rgba(43,29,121,.8)"},
            {background: "rgba(43,29,121,.8)"},
            {background: "rgba(0,0,255,.5)"},
            {background: "rgba(43,29,121,.8)"},
        ],{duration:5000,iterations:Infinity})
    }
    
}
export const stopAnimation = async () => {
    const element:HTMLElement = document.querySelector("#background__theme__anim")!
    const _leftElemet:HTMLElement = document.querySelector("#background__theme__anim")!
    _leftElemet.style.width = "100%";
    element.style.display = "none";
    await element.getAnimations().map(animation=>animation.finished)
}

export const ThemeContextProvider: FunctionComponent<
    PropsWithChildren<any>
> = ({ children }) => {
    const [theme, setTheme] = useState(LIGHT);

    const animateTheme = (element:HTMLElement,t:string) => {
        if (t === LIGHT) {
            element.animate([
                {backgroundImage: premium_white,opacity:1},
                {opacity:0.7},
                {backgroundImage: vicious_stance,opacity:1}
            ],{duration:300,fill:"forwards"})
        }
        if (t === DARK) {
            element.animate([
                {backgroundImage: vicious_stance,opacity:1},
                {opacity:0.7},
                {backgroundImage: premium_white,opacity:1}
            ],{duration:300,fill:"forwards"})
        }
       
    }

    const switchTheme = (t: string) => {
        setTheme(t);
        const root: HTMLDivElement | null =
            document.querySelector("#background__theme");
        if (root) {
            animateTheme(root,t)
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                switchTheme,
                theme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
