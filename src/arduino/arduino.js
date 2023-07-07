export const getPorts = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    
    return port;
}