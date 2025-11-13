export default function DocumentEditor() {
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
                    <div className="w-[595px] h-[892px] bg-white border-1 border-gray-200 m-10 p-4">
                        <div contentEditable className="">

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}