import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { DialogProvider } from "../context/DialogContext";
import PublicRoute from "./PublicRoute";
import { Login } from "./pages/Login";
import App from "../App";
import { Signup } from "./pages/Signup";
import { Error404 } from "../Error/404";

import style from "../assets/App.module.css";

/**
 * Toute les pages de l'application avec ses Routes
 * @returns
 */
export const Page = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DialogProvider>
                                <div className={style.bg}></div>

                                <App />
                            </DialogProvider>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <div className={style.bg}></div>

                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute>
                            <div className={style.bg}></div>
                            <Signup />
                        </PublicRoute>
                    }
                />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </BrowserRouter>
    );
};
