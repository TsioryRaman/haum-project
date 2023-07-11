import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../assets/modal.module.css";
function ModalSearchWiki({ biographie, bioClear, modal }) {
    const [lgShow, setLgShow] = useState(true);
    const [bio, setBIo] = useState(biographie)
    useEffect(() => {
        console.log("liste de biographie", bio)
    }, [])

    return (
        <>

            {/* <Button onClick={() => setLgShow(true)}>Large modal</Button> */}
            <Modal

                size="lg"
                show={lgShow}
                onHide={() => {
                    setLgShow(false)
                    bioClear([])
                    modal(false)
                }
                }
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <h3 >Liste des resultats</h3>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bio.map((biographie, i) => {
                        const url = `https://fr.wikipedia.org/?curid=${biographie.pageid}`;
                        return (
                            <div className="results">
                                <div className="result" key={i}>
                                    <h3>{biographie.title}</h3>
                                    <p className='text-dark' dangerouslySetInnerHTML={{ __html: biographie.snippet }}>
                                    </p>
                                    <a href={url}>Read more</a>
                                </div>
                            </div>)

                    })}
                </Modal.Body>
            </Modal >
        </>
    );
}

export default ModalSearchWiki;