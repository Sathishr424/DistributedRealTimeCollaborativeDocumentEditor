import {ReactNode, RefObject, useCallback, useEffect, useRef, useState} from "react";
import Editor from "./Editor/Editor";

export default function DocumentEditor() {
    const editorInstanceRef: RefObject<Editor | null> = useRef(null);

    useEffect(() => {
        if (editorInstanceRef.current === null) {
            editorInstanceRef.current = new Editor();
        }

        return () => {
            if (editorInstanceRef.current) {
                editorInstanceRef.current.dispose();
                editorInstanceRef.current = null;
            }
        }
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