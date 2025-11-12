import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/AuthService.js";
import { getRandomString } from "../../utils/helper";
import Navbar from "../../components/Navbar.jsx";
import AlertContext from "../../components/AlertContext.jsx";

export default function Register() {
    const { alert, setAlerts } = useContext(AlertContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirm_password] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const data = await UserService.register(email, username, password);
            if (data.success) {
                navigate("/");
            }
            setAlerts(prev => [...prev, { id: getRandomString(16), message: "Registration failed." }])
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            if (error.status === 405) {
                setAlerts(prev => [...prev, { id: getRandomString(16), message: "Email Already In Use" }])
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
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            /* Empty block */
        }
    }

    useEffect(() => {
        verifyLogin();
    }, [])

    return (
        <section>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div className="rounded border">
                    <div className="py-2 border-b">
                        <h2 className="p-2 font-bold text-lg">Sign Up</h2>
                    </div>
                    <div className="p-2">
                        <form onSubmit={onSubmit}>
                            <div className="flex flex-col my-2 justify-center min-w-[350px]">
                                <label htmlFor="username">Username</label>
                                <input placeholder="Username" value={username} onChange={(event) => setUsername(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="username" type="text" username='username' />
                            </div>
                            <div className="flex flex-col my-2 justify-center sm:min-w-[350px]">
                                <label htmlFor="email">Email</label>
                                <input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="email" type="email" username='email' />
                            </div>
                            <div className="flex flex-col my-2 justify-center sm:min-w-[350px]">
                                <label htmlFor="password">Password</label>
                                <input placeholder="****" value={password} onChange={(event) => setPassword(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="password" type="password" username='password' />
                            </div>
                            <div className="flex flex-col my-2 justify-center sm:min-w-[350px]">
                                <label htmlFor="confirm_password">Confirm Password</label>
                                <input placeholder="****" value={confirm_password} onChange={(event) => setConfirm_password(event.target.value)} required className="shadow appearance-none border w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1" id="confirm_password" type="password" username='confirm_password' />
                            </div>
                            <button className="px-8 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-800 cursor-pointer relative flex justify-center items-center" type="submit">
                                <span className={`${isLoading ? 'block' : 'hidden'} absolute left-2 h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
                                ></span>
                                Sign Up
                            </button>
                        </form>
                    </div>
                    <div className="flex flex-row justify-center">
                        <p className="p-2">
                            Already have an account? <a className="text-blue-400 hover:underline" href="/login">Login</a>
                        </p>
                    </div>
                </div>
            </main>
        </section>
    );
}