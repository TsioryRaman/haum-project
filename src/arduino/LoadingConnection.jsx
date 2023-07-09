import React from "react"
import Modal from "react-bootstrap/Modal"
// Icone
import {Power,AlertTriangle} from "react-feather";

export const LoadingBluetoothConnection = ({show,setLoadBluetooth,error}) => {

  const handleClose = () => setLoadBluetooth(false);

  const bgError = () => {
    return !error ? "bg-success":"bg-danger"
  }

    return <>
     <Modal show={show}  onHide={handleClose}>
        <Modal.Body className={`${bgError()} text-white`}>
          {!error ? 
            <LoadingNotificationPopup message="Connection avec Chat ROCO en cours..."><Power /></LoadingNotificationPopup> 
            : 
            <LoadingNotificationPopup message="Erreur de connection avec ROCCO"><AlertTriangle /></LoadingNotificationPopup>
          }
        </Modal.Body>
      </Modal>
    </>
}

// Popup du chargement
const LoadingNotificationPopup = ({message,children}) => {
return (
  <div className="d-flex flex-row justify-content-around"><span>{message}</span>{children}</div>
)
}