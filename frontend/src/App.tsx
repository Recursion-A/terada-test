import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import UpcomingMovies from './components/UpcomingMovies'
import MovieDetails from './components/MovieDetails'
import NowPlayingMovies from './components/NowPlayingMovies'
import TopRatedMovies from './components/TopRatedMovies'
import SearchMovies from './components/SearchMovies'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import { AuthProvider } from './context/AuthContext'
import LogoutForm from './components/LogoutForm'
import FavoriteMovies from './components/FavoriteMovies'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upcoming" element={<UpcomingMovies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/now_playing" element={<NowPlayingMovies />} />
          <Route path="/top_rated" element={<TopRatedMovies />} />
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LogoutForm />} />
          <Route path="/favorite_movies" element={<FavoriteMovies />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
