import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 rounded-3xl bg-[rgba(15,23,42,0.8)] p-10 text-center shadow-glow backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">404</p>
      <h1 className="text-4xl font-semibold text-white">Page not found</h1>
      <p className="max-w-xl text-slate-300">The page you’re looking for doesn’t exist. Return to the homepage to continue browsing movies.</p>
      <Link className="rounded-full bg-slate-100/5 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-slate-100/10" to="/">
        Back to home
      </Link>
    </div>
  )
}
