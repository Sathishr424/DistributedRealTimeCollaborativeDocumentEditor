import DashboardLayout from "./Layout";
import Navbar from "../../components/Navbar.jsx";

export default function Home() {
    return <DashboardLayout>
        <div className="m-5">
            <button className="text-underline">Create Document</button>
        </div>
    </DashboardLayout>
}