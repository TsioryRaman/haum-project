import React from "react"
import Modal from "react-bootstrap/Modal"

export const LoadingBluetoothConnection = ({show,setLoadBluetooth,error}) => {

  const handleClose = () => setLoadBluetooth(false);

    return <>
     <Modal show={show} onHide={handleClose}>
        <Modal.Body>{!error ? "Connection avec Chat ROCO en cours..." : "Erreur de connection"}</Modal.Body>
      </Modal>
    </>
}