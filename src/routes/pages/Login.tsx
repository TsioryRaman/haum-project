import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { defaultOptions } from "./Home";
import ispm from "../../assets/image/ispm.png"

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
                className="col-md-6 col-lg-4 col-sm-12"
                initial={{ opacity: 0, y: -80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <motion.div className="d-flex">
                <Lottie options={defaultOptions} height={150} width={150} />
                <img src={ispm} alt="logo__ispm"height={200} width={200} style={{filter:"brightness(90%)"}}/>
                </motion.div>
                <Form validated={!validate} onSubmit={submit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
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

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
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
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check
                            type="checkbox"
                            label="Se souvenir de moi"
                        />
                    </Form.Group>
                    <motion.div className="d-flex justify-content-between align-items-center">

                    <Button variant="outline-light" type="submit">
                        Se connecter
                    </Button>
                    <Link className="text-white ml-auto" to="/signup">Enregistrer ROCCO</Link>
                    </motion.div>
                </Form>
            </motion.div>
        </Container>
    );
};
