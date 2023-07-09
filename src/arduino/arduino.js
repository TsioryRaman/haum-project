export const getPorts = async (loadConnection) => {
    try {
        const port = await navigator.serial.requestPort();
        loadConnection(true);
        await port.open({ baudRate: 9600 });

        return port;
    }catch(e){
        
    }
}