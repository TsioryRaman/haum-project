import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { defaultOptions } from "./Home";
import ispm from "../../assets/image/ispm.png"

export const Signup = () => {
    const { signup } = useContext(UserContext);
    const [username, setUsername] = useState<string>("tsiory");
    const [password, setPassword] = useState<string>("maxtor123*");
    const [lastname,setLastname] = useState<string>("tsiory")
    const [address,setAddress] = useState<string>("Lot IVK 11")
    const [confirmPassword,setConfirmPassword] = useState<string>("maxtor123*");
    const [email, setEmail] = useState<string>("tsiory@gmail.com");
    const [validate, setValidate] = useState<boolean>(true);
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        switch(e.target.name){
            case "username":
                setUsername(e.target.value);
                break;
            case "email":
                setEmail(e.target.value);
                break;
            case "password":
                setPassword(e.target.value);
                break;
            case "confirmPassword":
                setConfirmPassword(e.target.value)
                break;
            case "lastname":
                setLastname(e.target.value)
                break;
            case "address":
                setAddress(e.target.value)
                break;
        }
    };

    const submit = async (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            await signup(data.get("email"),data.get("lastname"),data.get("address"),data.get("username"), data.get("password"));
            setValidate(true)
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
                className="col-md-6 col-lg-4 col-sm-12"
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            > <motion.div className="d-flex">
            <Lottie options={defaultOptions} height={150} width={150} />
            <img src={ispm} alt="logo__ispm"height={200} width={200} style={{filter:"brightness(90%)"}}/>
            </motion.div>
                <motion.h2 className="">Enregistrement de ROCCO</motion.h2>
                <Form validated={!validate} onSubmit={submit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            onChange={handleChange}
                            value={email}
                            placeholder="Email"
                        />
                        {!validate && (
                            <Form.Text className="text-danger">
                                Entrer un nom d'utilisateur valide
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Nom d'utilisateur</Form.Label>
                        <Form.Control
                            name="username"
                            type="text"
                            onChange={handleChange}
                            value={username}
                            placeholder="username"
                        />
                        {!validate && (
                            <Form.Text className="text-danger">
                                Entrer un nom d'utilisateur valide
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>lastname</Form.Label>
                        <Form.Control
                            name="lastname"
                            type="text"
                            onChange={handleChange}
                            value={lastname}
                            placeholder="lastname"
                        />
                        {!validate && (
                            <Form.Text className="text-danger">
                                Entrer un nom d'utilisateur valide
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Adresse</Form.Label>
                        <Form.Control
                            name="address"
                            type="text"
                            onChange={handleChange}
                            value={address}
                            placeholder="Adresse"
                        />
                        {!validate && (
                            <Form.Text className="text-danger">
                                Entrer une adresse valide
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
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
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Confirmer votre mot de passe</Form.Label>
                        <Form.Control
                            value={confirmPassword}
                            name="confirmPassword"
                            onChange={handleChange}
                            type="password"
                            placeholder="Confirmer votre mot de passe"
                        />
                        {!validate && (
                            <Form.Text className="text-danger">
                                Entrer un mot de passe valide
                            </Form.Text>
                        )}
                    </Form.Group>
                    <motion.div className="d-flex justify-content-between align-items-center">

                    <Button variant="outline-light" type="submit">
                        Enregister
                    </Button>

                    <Link className="text-white ml-auto" to="/login">Se connecter</Link>
                    </motion.div>
                </Form>
            </motion.div>
        </Container>
    );
};
