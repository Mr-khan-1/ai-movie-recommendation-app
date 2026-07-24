import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layouts/DefaultLayout'
import HomePage from '../pages/HomePage'
import MovieDetailsPage from '../pages/MovieDetailsPage'
import FavoritesPage from '../pages/FavoritesPage'
import NotFoundPage from '../pages/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies/:id" element={<MovieDetailsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
