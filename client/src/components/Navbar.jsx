export default function Navbar() {
  return (
    <div className="w-full py-2 flex flex-row items-center justify-between bg-gray-50 shadow">
        <h1 className="px-4 py-2 text-xl font-bold text-slate-400">
          <a href="/dashboard">Expense Tracker</a>
        </h1>
    </div>
  )
}