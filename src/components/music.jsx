import { useEffect, useState } from "react"
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Row from 'react-bootstrap/Row';

import Image from 'react-bootstrap/Image';

import Modal from 'react-bootstrap/Modal';
const CLIENT_ID = "609de20d191a43c8b8d69fff10bc78d9"
const CLIENT_SECRET = "cbdb243eabad4f06b0803671c9d00aa7"
export function Music({ artisteProps, onClearArtiste, modal }) {
    const [open, setOpen] = useState(false);
    const [lgShow, setLgShow] = useState(true);
    const [accessToken, setAccessToken] = useState("")
    const [albums, setAlbums] = useState(null)
    useEffect(() => {
        (async function () {

        const url = "https://accounts.spotify.com/api/token"
        const authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        const result = await fetch(url, authParameters)
        const data = await result.json()
        setAccessToken(data.access_token)
        await musicShow(data.access_token)
        // localStorage.setItem("token", accessToken);

        console.log("artiste dans le component", artisteProps)

        })()


    }, [artisteProps])

    async function musicShow(token) {
        if (artisteProps) {
            var artistParameters = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }
            var response = await fetch('https://api.spotify.com/v1/search?q=' + artisteProps + '&type=artist', artistParameters)
            var result = await response.json()
            var artistId = result.artists.items[0].id

            let Responsedata = await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums' + '?include_groups=album&market=US&limit=5', artistParameters)
            let data = await Responsedata.json()
            setAlbums(data.items)
            // var data = await Responsedata.json()
            // 
            setOpen(x => !x)
            onClearArtiste('')

        }
    }
    return (<>



        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal
                size="lg"
                show={lgShow}
                onHide={() => {
                    setLgShow(false)
                    onClearArtiste("")
                    modal(false)

                }
                }
                // onClick={() => onClose(false)}
                aria-labelledby="example-modal-sizes-title-lg"


            >
                <Modal.Header closeButton
                    style={{ 'backgroundColor': '#051512f0' }}
                >
                    <Modal.Title id="example-modal-sizes-title-lg">
                        <span style={{ 'color': '#8e8e8e' }}>ALBUM DE MUSIQUE</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 'backgroundColor': '#051512f0' }}>
                    {/* <Button variant="success" onClick={
                        musicShow
                    }
                        aria-controls="example-collapse-text"
                    >
                        SHOW ALBUM</Button> */}
                    {!albums && <span>Chargement...</span>}
                    {albums && albums.map((album, i) => {
                        return (
                            //{Array.from({ length: 1 }).map((album, i) => (
                            // <Row className="g-4">
                            //<Col lg={3} key={album}>
                            //<CardGroup>
                            // <Card>
                            //     <Card.Img variant="top" src={album.images[0].url} />
                            //     <Card.Body>
                            //         <Card.Title>{album.name}</Card.Title>
                            //         <Card.Text>
                            //             {album.name}
                            //         </Card.Text>
                            //     </Card.Body>
                            // </Card>
                            //</CardGroup>
                            //</Col>
                            //</Row>
                            //))}
                            <Collapse key={i} in={open}>
                                <div id="example-collapse-text">

                                    <Row style={{
                                        'marginBottom': '30px', 'marginTop': '30px', 'marginLeft': '10px'
                                    }}>
                                        <Col xs={6} md={4}>
                                            < Image src={album.images[0].url} roundedCircle style={{ 'width': '163px ' }} />
                                        </Col>
                                        <Col xs={12} md={8} style={{ 'color': 'white' }}>
                                            <h4 style={{ 'color': '#367dc7cf' }}>{album.name}</h4>
                                            <span ><u>Date de realisation:</u> {album.release_date} </span>
                                            <p>Nombre de Tracks {album.total_tracks}</p>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        )
                    })}
                </Modal.Body>
            </Modal >
        </div >
    </>
    )
} 
