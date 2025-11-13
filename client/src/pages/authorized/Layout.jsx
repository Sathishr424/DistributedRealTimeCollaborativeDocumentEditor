import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UserService from "../../services/AuthService.js";
import NavbarLoggedIn from "../../components/NavbarLoggedIn.jsx";

export default function DashboardLayout({children}) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    const checkLogin = async () => {
        try {
            const userData = await UserService.getUserData();

            if (userData == null || userData.id === undefined) {
                navigate('/login');
            }
            setUser(userData);
        } catch (error) {
            navigate('/login');
            console.log(error.status)
        }
    }

    useEffect(() => {
        checkLogin();
    }, [])

    return (
        <section>
            {children}
        </section>
    );
}