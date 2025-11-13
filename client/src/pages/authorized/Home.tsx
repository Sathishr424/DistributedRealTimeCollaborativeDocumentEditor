import DashboardLayout from "./Layout";
import {Link} from "react-router-dom";
import NavbarLoggedIn from "@components/NavbarLoggedIn";

export default function Home() {
    return <DashboardLayout>
        <NavbarLoggedIn />
        <div className="m-5">
            <div className="m-2">
                <Link to="/document" className="cursor-pointer underline hover:text-blue-500 text-lg">Create Document</Link>
            </div>
            <div className="m-2 mt-10">
                <h1 className="text-lg">Previous Documents</h1>
                <div className="">
                    Noting here...
                </div>
            </div>
        </div>
    </DashboardLayout>
}