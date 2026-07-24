import { Outlet } from 'react-router-dom'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <main className="px-4 py-6 md:px-8 lg:px-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
