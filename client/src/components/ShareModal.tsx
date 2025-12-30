import React, {useContext, useState} from "react";
import Spinner from "@components/svgComponents/Spinner";
import Close from "@components/svgComponents/Close";
import DocumentService from "../services/DocumentService";
import AlertContext from "@components/AlertContext";
import {getRandomString} from "@utils/helper";
import {DocumentAccessResponseDTO} from "../dto/DTOs";
import {useLocation} from "react-router-dom";

export default function ShareModal({documentAccess, toggleShare, setToggleShare}: {
    documentAccess: DocumentAccessResponseDTO,
    toggleShare: boolean,
    setToggleShare: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const {alerts, setAlerts} = useContext(AlertContext);
    const [onSaveLoading, setOnSaveLoading] = useState(false);
    const [readAccess, setReadAccess] = useState(documentAccess.document.read_access);
    const [writeAccess, setWriteAccess] = useState(documentAccess.document.write_access);
    const [isCopied, setIsCopied] = useState(false);
    const location = useLocation();

    const saveAccess = async () => {
        if (documentAccess.document_key !== undefined) {
            setOnSaveLoading(true);
            DocumentService.updateDocumentAccess({
                document_key: documentAccess.document_key,
                write_access: writeAccess,
                read_access: readAccess
            }).then(res => {
                console.log(res)
                setOnSaveLoading(false);
                if (res.success) return setToggleShare(false);
                setAlerts(prev => [...prev, {id: getRandomString(16), message: "Unable to update document, something went wrong in the server"}]);
            }).catch(err => {
                setOnSaveLoading(false);
                setAlerts(prev => [...prev, {id: getRandomString(16), message: err.response.data.message}]);
            })
        }
    }

    const copyShareLink = async () => {
        try {
            const shareLink = window.location.origin + "/document/" + documentAccess.document_key;
            await navigator.clipboard.writeText(shareLink);
            setIsCopied(true);
        } catch (err) {
            console.log(err);
        }
    }

    return toggleShare && documentAccess.document_key !== undefined ?
        <div className="fixed left-0 top-0 w-[100vw] h-[100vh] bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded shadow">
                <div className="py-3 px-4 border-b-2 border-gray-200 flex flex-row justify-between items-center">
                    <h2 className="text-xl">Share</h2>
                    <button onClick={() => setToggleShare(false)} className="cursor-pointer w-9 h-9 rounded-full hover:bg-slate-200 p-2">
                        <Close />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex flex-row items-center py-2 px-6 bg-slate-100 rounded">
                        <p className="mx-6">{documentAccess.document_key}</p>
                        <button onClick={copyShareLink} className="cursor-pointer ml-3 py-1 px-6 border-1 rounded-lg border-gray-400 hover:bg-slate-300">
                            {
                                isCopied ? "Copied" : "Copy"
                            }
                        </button>
                    </div>
                    <div className="mt-2 p-2">
                        <p className="">Permissions:</p>
                        <div className="py-2">
                            <div className="flex flex-row items-center my-2">
                                <input id="read_access" type="checkbox"
                                       checked={readAccess}
                                       onChange={(e) => setReadAccess(e.target.checked)}
                                       className="w-5 h-5 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-brand-soft"/>
                                <label className="mx-2" htmlFor="read_access">Read access</label>
                            </div>
                            <div className="flex flex-row items-center my-2">
                                <input id="write_access" type="checkbox"
                                       checked={writeAccess}
                                       onChange={(e) => setWriteAccess(e.target.checked)}
                                       className="w-5 h-5 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-brand-soft"/>
                                <label className="mx-2" htmlFor="write_access">Write access</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-end items-center px-4 pb-4">
                    <button onClick={saveAccess} className="cursor-pointer px-5 py-2 shadow bg-blue-500 hover:bg-blue-600 text-white rounded-md flex flex-row justify-center items-center">
                        {
                            onSaveLoading ? <Spinner /> : <></>
                        }
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div> : <></>;
}