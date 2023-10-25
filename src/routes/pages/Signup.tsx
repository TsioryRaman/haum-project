import { useContext, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import { defaultOptions } from "./Home";
import ispm from "../../assets/image/ispm.png";
import style from "../../assets/signup.module.css"

interface ErrorType {
    username:string|null;
    password:string|null;
    email:string|null;
    passKey:string|null;
}

export const Signup = () => {
    const { signup,loading } = useContext(UserContext);
    const [username, setUsername] = useState<string>("tsiory");
    const [password, setPassword] = useState<string>("maxtor123*");
    const [lastname, setLastname] = useState<string>("tsiory");
    
    const [key, setKey] = useState<string>("1234-1234-1234-1234");
    const [address, setAddress] = useState<string>("Lot IVK 11");
    const [confirmPassword, setConfirmPassword] =
        useState<string>("maxtor123*");
    const [email, setEmail] = useState<string>("tsiory@gmail.com");
    const [validate, setValidate] = useState<boolean>(true);
    const [error,setError] = useState<ErrorType | null>({username:null,password:null,email:null,passKey:null})
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setError(null)
        switch (e.target.name) {
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
                setConfirmPassword(e.target.value);
                break;
            case "lastname":
                setLastname(e.target.value);
                break;
            case "address":
                setAddress(e.target.value);
                break;
            case "passKey":
                setKey(e.target.value)
                // const _key = key
                // if(_key.length >= 4)
                // {
                //     setKey(k => k + "-")
                // }
                // _key.split('-')
                break;
        }
    };

    const submit = async (e: any) => {
        e.preventDefault();
        const data = new FormData(e.target);
        try {
            await signup(
                data.get("email"),
                data.get("lastname"),
                data.get("address"),
                data.get("username"),
                data.get("password"),
                data.get('passKey')
            );
            setValidate(true);
        } catch (e:any) {
            setValidate(false);
            const error = await e.json();
            setError(error)
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
                    className="d-flex row shadow rounded-lg"
                    initial={{ opacity: 0, y: -80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{width:"100%"}}
                    exit={{opacity:0}}
                >
            <motion.div className={`col-lg-8 col-md-6 col-sm-12 d-flex flex-column justify-content-center align-items-center ${style.signup__presentation}`} style={{background:"#100f4ce3"}}>
            <motion.div className="d-flex"
                initial={{opacity:0}}
                animate={{opacity:0.8}}
                transition={{duration:1,delay:0.6}}>
                        <Lottie
                            options={defaultOptions}
                            height={150}
                            width={150}
                        />
                        <img
                            src={ispm}
                            alt="logo__ispm"
                            height={200}
                            width={200}
                            style={{ filter: "brightness(90%)" }}
                        />
                    </motion.div>

                    <motion.h2 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:2.4}}><span style={{fontFamily:"Jura"}}>ROCCO</span>, votre compagnon de tout les jours</motion.h2>
            </motion.div>
            <Card className="col-md-6 col-lg-4 col-sm-12 px-5" style={{position:"relative",background:"transparent", padding:"2rem",border:"none",borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px"}}>

            <motion.div
                    style={{background:"#1a1e7f",position:"absolute",top:"0",bottom:"0",right:"0",width:"100%",height:"100%",zIndex:-1}}></motion.div>
                    <motion.h3 initial={{opacity:0}} transition={{duration:0.8,delay:0.6}} animate={{opacity:1}} className={`text-white text-left shadow rounded text-uppercase ${style.header__signup}`}>Enregistrement <span style={{fontFamily:"Jura"}}>ROCCO</span></motion.h3>
                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                onChange={handleChange}
                                value={email}
                                placeholder="Email"
                            />
                            {!validate && error?.email && (
                                <Form.Text className="text-danger">
                                    
                                    {error?.email}
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
                            {!validate && error?.username && (
                                <Form.Text className="text-danger">
                                    
                                    {error?.username}
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
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                        >
                            <Form.Label>
                                Confirmer votre mot de passe
                            </Form.Label>
                            <Form.Control
                                value={confirmPassword}
                                name="confirmPassword"
                                onChange={handleChange}
                                type="password"
                                placeholder="Confirmer votre mot de passe"
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3 pb-8"
                            controlId="formKey"
                        >
                            <Form.Label>
                                Entrer votre cle de produit
                            </Form.Label>
                            <Form.Control
                                value={key}
                                name="passKey"
                                onChange={handleChange}
                                type="text"
                                placeholder="Entrer votre cle de produit"
                            />
                            {!validate && error?.passKey && (
                                <Form.Text className="text-danger">
                                    {error?.passKey}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <motion.div className="d-flex justify-content-between align-items-center mt-4">
                            <Button variant="outline-light" disabled={loading} type="submit">
                                Enregister
                            </Button>

                            <Link className="text-white ml-auto" to="/login">
                                Se connecter
                            </Link>
                        </motion.div>
                    </Form>

            </Card>
                </motion.div>
        </Container>
    );
};
