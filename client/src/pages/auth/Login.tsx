import {FormEvent, useContext, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/AuthService";
import Navbar from "../../components/Navbar";
import { getRandomString } from "../../utils/helper";
import JWTService from "../../services/JWTService";
import AlertContext from "../../components/AlertContext";
import {AlertItem} from "../../interfaces/Alerts";

export default function Login() {
    const { alerts, setAlerts } = useContext(AlertContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const data = await UserService.login({email, password});
            if (data.token !== undefined && data.token.length > 0) {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Login successfull!" }])
                navigate("/");
            } else {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Login failed" }])
            }
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            console.log(error);
            if (error.status === 401) {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Invalid Credentials" }])
            } else if (error.status === 400) {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Invalid Credentials" }])
            } else {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Server Error" }])
            }
        }
    }

    const verifyLogin = async () => {
        try {
            const isLoggedIn = await UserService.isUserLoggedIn();

            if (isLoggedIn) {
                navigate("/");
            } else {
                JWTService.removeToken();
            }
        } catch (error) { }
    }

    useEffect(() => {
        verifyLogin();
    }, [])

    return <section>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="rounded border">
                <div className="py-2 border-b">
                    <h2 className="p-2 font-bold text-lg">Login</h2>
                </div>
                <div className="p-2">
                    <form onSubmit={(event) => onSubmit(event)}>
                        <div className="flex flex-col my-2 justify-center min-w-[350px]">
                            <label htmlFor="email">email</label>
                            <input typeof="email" placeholder="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="email" type="text" name='email' />
                        </div>
                        <div className="flex flex-col my-2 justify-center min-w-[350px]">
                            <label htmlFor="password">Password</label>
                            <input placeholder="****" value={password} onChange={(event) => setPassword(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="password" type="password" name='password' />
                        </div>
                        <button className="px-8 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 cursor-pointer relative flex justify-center items-center" type="submit">
                            <span className={`${isLoading ? 'block' : 'hidden'} absolute left-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
                            ></span>
                            Login
                        </button>
                    </form>
                </div>
                <div className="flex flex-row justify-center">
                    <p className="p-2">
                        Don't have an account? <a className="text-blue-400 hover:underline" href="/register">Sign Up</a>
                    </p>
                </div>
            </div>
        </main>
    </section>
}