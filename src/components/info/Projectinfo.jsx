import React from 'react';
import style from "../../assets/Projectinfo.module.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { ChevronUp } from 'react-feather';

import { css } from "@emotion/css";
import { motion } from "framer-motion";

const Projectinfo = ({ info, showInfo }) => {
    const membre = [{
        name: "Ranaivoarilala Tahiana Andriamahery",
        numeros: 5
    },
    {
        name: "Andrianjaka Tahinjanahary Johnson",
        numeros: 7
    },
    {
        name: "Rafaralahizakason Toky",
        numeros: 15
    },
    {
        name: "Ramanantoanina Safidy Tsioriniaina",
        numeros: 16
    }, {
        name: "Andrianarivo Sitrakiniaina Herinomena",
        numeros: 17
    }]
    const description = "Roco (ou RObot COmpagnon) est un robot de compagnie aux enfants hospitalisés qui les aides à se divertir en faisant oublier leur quotidien grâce à divers jeu sonorisé amusant pour les enfants. ROCO peut venir en aides aux parents pour les taches comme le rappel des notes important dans leur agenda liée à son smartphones qui est connecté.  Pour son fonctionnement, il suffit de l’appeler par son nom pour qu’il puisse nous offrir son aidé. Il a la capacité de se déplacer sans problème même s’il y a des obstacles sur son chemin car il est muni d’un capteur. Il possède un micro permettant à l’utilisateur de donner des ordres et pour se communiquer. Grace à son Intelligence Artificielle intégré, il peut accomplir leur mission tout seul."

    return <div className={`${style.container} ${info ? style.open : style.close} `} style={{ backdropFilter: "blur(8px)", zIndex: 8 }}>
        <div className={`${style.contenu} text-white ${css({
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
        })}`}>
            <h3 className={style.projectTitle}>
                Projet : ROCO (Robot compagnon)
            </h3>
            <h1>
                Filière :
            </h1>
            <p>Electronique Syteme Informatique et Intelligence Artificielle (ESSIA-4)</p>
            <h3>
                Membre du groupe :
            </h3>
            <div className={style.list_group}>
                {membre.map((value, index) => <motion.p className={css({
                    fontSize: 20,
                })}
                    key={index}>{value.name} - N-{value.numeros}</motion.p>)}
            </div>
            <motion.h6
                className={`${css({
                    fontSize: "1.6em"
                })}`}>
                Pr&eacute;s&eacute;ntation du projet
            </motion.h6>
            <motion.p
                className={`${css({
                    fontSize: "1.2em",
                    marginLeft: "3em",
                    marginRight: "3em"
                })}`}>
                {description}
            </motion.p>
            <button className="btn btn-outline-light" onClick={() => showInfo()}>
                Fermer <ChevronUp />
            </button>
        </div>
    </div>
};

export default Projectinfo;