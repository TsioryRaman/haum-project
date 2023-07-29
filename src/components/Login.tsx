import { FormEventHandler, useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const {user,login} = useContext(UserContext)
    const [username,setUsername] = useState<string>("")
    const [password,setPassword] = useState<string>("")
    const [validate,setValidate] = useState<boolean>(true)
    const navigate = useNavigate();

    const handleChange = (e:any) => {
        if(e.target.name==="username"){
            setUsername(e.target.value)
            if(username.length > 5){
                setValidate(true)
            }
            return
        }
        setPassword(e.target.value)
    }

    const submit = async (e:any) => {
        e.preventDefault()
        const data = new FormData(e.target)
        try {
            await login(data.get("username"),data.get("password"))
            if(user){
                navigate("/")
            }
        }catch(e){
            setValidate(false)
        }
    }

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
        }}>
        <Form className="col-md-3" validated={!validate} onSubmit={submit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="username" type="text" onChange={handleChange} value={username} placeholder="Nom d'utilisateur ROCCO" />
                {!validate && 
                <Form.Text className="text-danger">
                    Entrer un nom d'utilisateur valide
                </Form.Text>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control style={{boxSizing:"border-box"}} value={password} name="password" onChange={handleChange} type="password" placeholder="Mot de passe" />
                {!validate && 
                <Form.Text className="text-danger">
                    Entrer un mot de passe valide
                </Form.Text>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Se souvenir de moi" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        </Container>
    );
};
