import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import UserService from "../../services/AuthService";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
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