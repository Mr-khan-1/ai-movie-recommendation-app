export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070a13] py-8 mt-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-slate-400 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-sky-500 text-center text-sm font-bold text-white leading-6 shadow-sm">
              C
            </div>
            <p className="text-sm font-semibold tracking-wider text-slate-200 uppercase">CineMatch</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            <a className="transition hover:text-white" href="#twitter" onClick={(e) => e.preventDefault()}>Twitter</a>
            <a className="transition hover:text-white" href="#instagram" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a className="transition hover:text-white" href="#github" onClick={(e) => e.preventDefault()}>GitHub</a>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-white/5 pt-4">
          <p className="text-xs text-slate-500">© 2026 CineMatch. Designed for modern film exploration.</p>
          <p className="text-xs text-slate-600 max-w-lg">
            Built using React, TypeScript, and Tailwind CSS. Synchronized with browser LocalStorage.
          </p>
        </div>
      </div>
    </footer>
  )
}
