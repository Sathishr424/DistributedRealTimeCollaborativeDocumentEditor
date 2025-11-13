import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../services/AuthService";
import {useNavigate} from "react-router-dom";

export default function NavbarLoggedIn() {
    const navigate = useNavigate();
    const logout = async () => {
        await AuthService.logout();
        navigate("/login");
    }

    return (
        <div className="w-full py-2 flex flex-row items-center justify-between bg-gray-50 shadow">
            <h1 className="px-4 py-2 text-xl font-bold text-slate-400">
                <a href="/dashboard">Expense Tracker</a>
            </h1>
            <div className="">
                <button className={`flex flex-row items-center m-2 hover:text-red-500 text-blue-400 text-2xl cursor-pointer`} onClick={logout}>
                    <div className="">
                        <FontAwesomeIcon size={"lg"} icon={faPowerOff}/>
                    </div>
                    <h4 className={"text-lg"}>Logout</h4>
                </button>
            </div>
        </div>
    )
}