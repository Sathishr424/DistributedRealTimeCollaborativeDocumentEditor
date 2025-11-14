import {RefObject, useEffect, useRef} from "react";
import Editor from "./Editor/Editor";

export default function DocumentEditor() {
    const canvasRef: RefObject<HTMLCanvasElement | null> =  useRef(null);
    const editorInstanceRef: RefObject<Editor | null> = useRef(null);

    useEffect(() => {
        const canvasElement = canvasRef.current;

        if (canvasElement) {
            console.log(canvasElement)
            editorInstanceRef.current = new Editor(canvasElement);
            editorInstanceRef.current.attachEvents();
        }

        return () => {
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
                <div className="w-full flex items-center justify-center">
                    <div className="bg-white border-1 border-gray-200 m-10 p-4">
                        <canvas className="cursor-text" ref={canvasRef} width="595px" height="892px"></canvas>
                    </div>
                </div>
            </div>
        </main>
    )
}