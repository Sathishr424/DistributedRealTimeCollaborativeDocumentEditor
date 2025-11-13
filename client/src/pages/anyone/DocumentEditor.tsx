import {RefObject, useEffect, useRef} from "react";

export default function DocumentEditor() {
    let editor: RefObject<Editor | null> = useRef(null);

    useEffect(() => {
        let canvas = document.querySelector("canvas");
        if (canvas) editor.current = new Editor(canvas);
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
                    <canvas width="595px" height="892px" className="bg-white border-1 border-gray-200 m-10 p-4"></canvas>
                </div>
            </div>
        </main>
    )
}