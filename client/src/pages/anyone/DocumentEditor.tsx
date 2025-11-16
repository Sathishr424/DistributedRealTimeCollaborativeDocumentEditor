import {ReactNode, RefObject, useCallback, useEffect, useRef, useState} from "react";
import Editor from "./Editor/Editor";
import SubscriptionForPageCreation from "./Editor/SubscriptionForPageCreation";
import {CanvasContainer} from "./Editor/CanvasContainer";

export default function DocumentEditor() {
    const [canvasCnt, setCanvasCnt] = useState(1);
    const canvasContainerRef = useRef(null);
    const canvasRefs: RefObject<HTMLCanvasElement[]> =  useRef([]);
    const editorInstanceRef: RefObject<Editor | null> = useRef(null);
    const canvasContainerInstanceRef: RefObject<CanvasContainer | null> = useRef(null);

    canvasRefs.current = [];

    const setCanvasRef = useCallback((el: HTMLCanvasElement) => {
        if (el) {
            console.log(el);
            canvasRefs.current.push(el);
            if (canvasContainerInstanceRef.current) {
                canvasContainerInstanceRef.current.appendCanvas(el);
            }
        }
    }, []);

    useEffect(() => {
        if (canvasRefs.current.length > 0) {
            const canvasElement = canvasRefs.current[0];

            if (canvasElement && canvasContainerRef.current) {
                canvasContainerInstanceRef.current = new CanvasContainer(canvasElement);
                editorInstanceRef.current = new Editor(canvasElement, canvasContainerRef.current, canvasContainerInstanceRef.current);
            }
        }

        let unsubscribe = SubscriptionForPageCreation.subscribeForCanvas((pages) => {
            setCanvasCnt(pages);
        })

        return () => {
            editorInstanceRef.current ? editorInstanceRef.current.dispose() : null;
            unsubscribe();
        }
    }, [])

    function renderCanvases(): ReactNode[] {
        let nodes: ReactNode[] = [];

        for (let i=0; i<canvasCnt; i++) {
            nodes.push(
                <div key={i} className="bg-white border-1 border-gray-200 m-10 p-10">
                    <canvas ref={setCanvasRef} className="cursor-text" width="595px" height="892px"></canvas>
                </div>
            );
        }

        return nodes;
    }

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
                <div ref={canvasContainerRef} className="w-full flex flex-col items-center justify-center canvas-container">
                    {
                        renderCanvases()
                    }
                </div>
            </div>
        </main>
    )
}