// Connexion avec le port serie de ROCCO
export const getPorts = async (loadConnection,speak) => {
    try {
        const port = await navigator.serial.requestPort();
        loadConnection(true);
        speak({text:"Connexion en cours avec Rocco"})
        await port.open({ baudRate: 9600 });

        return port;
    }catch(e){
        throw e;
    }
}

export const sendRoccoData = async (port,code,text,replyUser) => {
    try{
        const writer = await port.writable.getWriter();

        let enc = new TextEncoder();
        await writer.write(enc.encode(code));
        replyUser(text)
        writer.releaseLock();
        }catch(e){
            replyUser("Desole, Rocco n'est pas encore connecté")
            throw e;
        }
}