import React from 'react';
import style from "../../assets/Projectinfo.module.css"


const Projectinfo = ({ info }) => {
    return <div className={` ${style.container} ${info ? style.open : style.close}  plum_plate`}>
        <div className={`${style.contenu} text-white`}>
            <h3 className={style.projectTitle}>
                Projet : HAUM (Human's Machine)
            </h3>
            <h6 className={style.title}>
                Filière :
            </h6>
            <p>Electronique Syteme Informatique et Intelligence Artificielle (ESSIA-3)</p>
            <h6 className={style.title}>
                Membre du groupe :
            </h6>
            <ul className={style.list_group}>
                <li>Finaritra Haritiana</li>
                <li>Carter</li>
                <li>Francia</li>
                <li>Tahiana</li>
                <li>Toky</li>
                <li>Tendry</li>
                <li>Tsiory</li>
            </ul>
            <h6 className={style.title}>
                Pr&eacute;s&eacute;ntation du projet
            </h6>
            <p>
                Sunt extumes vitare bassus, lotus rectores.Music, bliss and an important inner world.
            </p>
        </div>
    </div>
};

export default Projectinfo;