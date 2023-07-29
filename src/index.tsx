import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";
import { DialogProvider } from "./context/DialogContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Login } from "./components/Login";

ReactDOM.render(
    <UserContextProvider>
        <BrowserRouter>
            <Routes>
                <Route
                    
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DialogProvider>
                                <App />
                            </DialogProvider>
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </UserContextProvider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
