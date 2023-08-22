import { useContext, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { defaultOptions } from "./Home";
import ispm from "../../assets/image/ispm.png";

export const Login = () => {
    const { user, login } = useContext(UserContext);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validate, setValidate] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        if (e.target.name === "username") {
            setUsername(e.target.value);
            if (username.length > 5) {
                setValidate(true);
            }
            return;
        }
        setPassword(e.target.value);
    };

    const submit = async (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            await login(data.get("username"), data.get("password"));
        } catch (e) {
            setValidate(false);
        }
    };

    return (
        <Container
            style={{
                minHeight: "100vh",
                position: "relative",
                height: "100%",
                overflowX: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <motion.div
                className="col-md-8 col-lg-6 col-xl-4 col-sm-12"
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                exit={{opacity:0}}
            >
                <motion.div
                    style={{
                        transformStyle: "preserve-3d",
                        transform:
                            "rotateX(1deg) rotateY(25deg) perspective(500px)",
                        cursor:"default"
                    }}
                >
                    <motion.p
                        initial={{ transform: "translateZ(0px)" }}
                        animate={{ opacity: 1, transform: "translateZ(150px)" }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                        style={{
                            fontSize: "4rem",
                            fontWeight: "bold",
                            fontFamily: "Jura",
                            transform: "translateZ(150px)",
                        }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: -180 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0 }}
                            style={{ display: "inline-block" }}
                        >
                            R
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            style={{ display: "inline-block" }}
                        >
                            O
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            style={{ display: "inline-block" }}
                        >
                            C
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            style={{ display: "inline-block" }}
                        >
                            C
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: -80 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.2 }}
                            style={{ display: "inline-block" }}
                        >
                            O
                        </motion.span>
                    </motion.p>
                    <motion.p
                        initial={{opacity: 0, transform:"translateZ(0px)"}}
                        animate={{opacity: 1, transform:"translateZ(-150px)"}}
                        style={{
                            fontSize: "3rem",
                            fontWeight: "bold",
                            fontFamily: "Karla",
                            transform: "translateZ(-150px)",
                        }}
                        transition={{duration:0.8, delay:2.2}}
                    >
                        Bienvenue
                    </motion.p>
                </motion.div>
                <Card style={{ padding: "4.5rem 2rem",position:"relative",background:"transparent",border:"none",borderRadius:"8px" }}>
                    <motion.div 
                    style={{background:"#1a1e7f",position:"absolute",top:"0",bottom:"0",right:"0",width:"100%",height:"100%",zIndex:-1,filter:"blur(4px)",borderRadius:"8px"}}>

                    </motion.div>
                    <motion.div className="d-flex flex-column justify-content-between" style={{marginBottom:"1rem"}}>
                        <Lottie
                            options={defaultOptions}
                            height={100}
                            width={100}
                        />
                        {/* <img
                            src={ispm}
                            alt="logo__ispm"
                            height={100}
                            width={100}
                            style={{ filter: "brightness(90%)" }}
                        /> */}
                        <motion.h3 className="text-center" style={{marginTop:"1rem"}}>Identification</motion.h3>
                    </motion.div>
                    <Form validated={!validate} onSubmit={submit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control
                                name="username"
                                type="text"
                                onChange={handleChange}
                                value={username}
                                placeholder="Nom d'utilisateur ROCCO"
                            />
                            {!validate && (
                                <Form.Text className="text-danger">
                                    Entrer un nom d'utilisateur valide
                                </Form.Text>
                            )}
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                        >
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                value={password}
                                name="password"
                                onChange={handleChange}
                                type="password"
                                placeholder="Mot de passe"
                            />
                            {!validate && (
                                <Form.Text className="text-danger">
                                    Entrer un mot de passe valide
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox"
                        >
                            <Form.Check
                                type="checkbox"
                                label="Se souvenir de moi"
                            />
                        </Form.Group>
                        <motion.div className="d-flex justify-content-between align-items-center">
                            <Button variant="outline-light" type="submit">
                                Se connecter
                            </Button>
                        </motion.div>

                        <Link className="text-white ml-auto" style={{marginTop:"1rem",display:"inline-block"}} to="/signup">
                                Enregistrer ROCCO
                            </Link>
                    </Form>
                </Card>
            </motion.div>
        </Container>
    );
};
