import React from 'react';
import style from  "../../assets/Projectinfo.module.css"
import "bootstrap/dist/css/bootstrap.min.css"


const Projectinfo = ({info}) => {
    return <div className={` ${style.container} ${info ? style.open : style.close }`} style={{backdropFilter:"blur(8px)",zIndex:8}}>
        <div className={`${style.contenu} text-white`}>
            <h3 className={style.projectTitle}>
                Projet : ROCCO (Robot compagnon)
            </h3>
            <h6 className={style.title}>
                Filière :
            </h6>
            <p>Electronique Syteme Informatique et Intelligence Artificielle (ESSIA-4)</p>
            <h6 className={style.title}>
                Membre du groupe :
            </h6>
            <ul className={style.list_group}>
                <li>Didi</li>
                <li>Tahiana</li>
                <li>Tendry</li>
                <li>Toky</li>
                <li>Tsiory</li>
                <li>Sitraka</li>
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