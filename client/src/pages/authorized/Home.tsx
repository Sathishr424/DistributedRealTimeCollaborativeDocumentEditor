import DashboardLayout from "./Layout";
import {Link, useNavigate} from "react-router-dom";
import NavbarLoggedIn from "@components/NavbarLoggedIn";
import DocumentService from "../../services/DocumentService";
import {DocumentResponseDTO} from "../../dto/DTOs";

export default function Home() {
    const navigate = useNavigate();

    const createDocument = () => {
        DocumentService.createDocument().then((document: DocumentResponseDTO) => {
            navigate(`/document/${document.document_key}`)
        }).catch((error: any) => {
            console.log(error);
        })
    }

    return <DashboardLayout>
        <NavbarLoggedIn />
        <div className="m-5">
            <div className="m-2">
                <button onClick={createDocument} className="cursor-pointer underline hover:text-blue-500 text-lg">Create Document</button>
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