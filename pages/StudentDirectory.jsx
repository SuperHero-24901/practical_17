import { useEffect, useMemo, useState } from "react";
import StudentCard from "../components/StudentCard";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal });
        if (!response.ok) throw new Error("The student directory could not be loaded.");
        const data = await response.json();
        setStudents(data);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") { setError(err.message || "Something went wrong."); setStatus("error"); }
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => students.filter((s) => `${s.name} ${s.email} ${s.company?.name}`.toLowerCase().includes(search.toLowerCase())), [students, search]);

  return <main className="min-h-screen bg-[#f5f7fb]"><header className="bg-slate-950 px-5 py-7 text-white sm:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500 text-xl">✦</div><div><p className="font-bold">Campus Connect</p><p className="text-xs text-slate-400">STUDENT DIRECTORY</p></div></div><span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300">API connected</span></div></header>
  <section className="mx-auto max-w-7xl px-5 py-10 sm:px-10"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">People & community</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Student directory</h1><p className="mt-3 max-w-xl text-slate-500">Explore the directory, find student profiles, and discover their contact details.</p></div><div className="rounded-2xl bg-white px-5 py-4 shadow-sm"><p className="text-sm text-slate-500">Profiles loaded</p><p className="text-2xl font-black">{status === "success" ? students.length : "—"}</p></div></div>
  <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4"><span className="text-slate-400">⌕</span><input className="w-full bg-transparent py-3.5 outline-none" placeholder="Search by name, email or company..." value={search} onChange={(e) => setSearch(e.target.value)}/></div><button onClick={() => { setSearch(""); }} className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Clear search</button></div>
  {status === "loading" && <div className="grid gap-5 pt-6 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map((n)=><div key={n} className="h-56 animate-pulse rounded-2xl bg-white shadow-sm"/>)}</div>}
  {status === "error" && <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700"><h2 className="font-bold">Unable to load profiles</h2><p className="mt-1 text-sm">{error}</p><button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white" onClick={() => window.location.reload()}>Try again</button></div>}
  {status === "success" && <><p className="mt-6 text-sm text-slate-500">Showing <strong>{filtered.length}</strong> of {students.length} profiles</p><div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((student, index)=><StudentCard key={student.id} student={student} index={index}/>)}</div>{!filtered.length && <div className="mt-5 rounded-2xl bg-white p-10 text-center"><p className="font-bold">No matching profiles</p><p className="mt-1 text-sm text-slate-500">Try a different name or email.</p></div>}</>}</section></main>;
}
