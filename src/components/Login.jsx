import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { UserContext } from "../Context/UserContext";
import { Navigate, redirect, useNavigate } from "react-router-dom";

export const Login = () => {
    const {setUser} = useContext(UserContext)
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [validate,setValidate] = useState(true)
    const navigate = useNavigate();

    const handleChange = (e) => {
        if(e.target.name==="username"){
            setUsername(e.target.value)
            if(username.length > 5){
                setValidate(true)
            }
            return
        }
        setPassword(e.target.value)
    }

    const submit = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch("http://localhost:3000/auth/login",{
                method:"POST",
                headers:{
                    "Content-type":"application/json"
                },
                body:JSON.stringify({username,password})
            })
            if(response.ok){
                const _user = await response.json()
                console.log(_user)
                setUser({..._user,isAuthenticated:true})

                // Naviguer sur "/"
                navigate("/")
            }
            setValidate(false)
        }catch(error){
            console.log("error:",error)
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
        <Form validated={!validate} onSubmit={submit}>
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
                <Form.Control value={password} name="password" onChange={handleChange} type="password" placeholder="Mot de passe" />
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
