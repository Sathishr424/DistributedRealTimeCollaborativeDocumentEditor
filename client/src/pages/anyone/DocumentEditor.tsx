import {ReactNode, RefObject, useCallback, useContext, useEffect, useRef, useState} from "react";
import Editor from "@utils/Editor/Editor";
import {useNavigate, useParams} from "react-router-dom";
import DocumentService from "../../services/DocumentService";
import AlertContext from "@components/AlertContext";
import {getRandomString} from "@utils/helper";

export default function DocumentEditor() {
    const { alerts, setAlerts } = useContext(AlertContext);
    const navigate = useNavigate();
    const { document_key } = useParams();

    const editorInstanceRef: RefObject<Editor | null> = useRef(null);

    const initiateDocument = async () => {
        if (!document_key) {
            return navigate("/");
        }
        const documentAccess = await DocumentService.getDocumentAccess(document_key);
        if (!documentAccess.read_access) {
            setAlerts(prev => [...prev, { id: getRandomString(16), message: "You have no read access!" }]);
            return navigate("/");
        }

        if (editorInstanceRef.current === null) {
            editorInstanceRef.current = new Editor(document_key, documentAccess.write_access);
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.dispose();
                editorInstanceRef.current = null;
            }
        }
    }

    useEffect(() => {
        initiateDocument();
    }, [])

    return (
        <main className="flex flex-col h-screen">
            <header className="document-header bg-slate-100 border-b-2 border-gray-300">
                <div className="flex flex-row items-center justify-between items-center p-4">
                    <button className="btn-primary">
                        Share
                    </button>
                </div>
            </header>
            <div className="document-body bg-slate-100 overflow-auto">
                <div className="w-full flex flex-col items-center justify-center canvas-container">

                </div>
            </div>
        </main>
    )
}