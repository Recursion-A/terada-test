import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PopularMovies from './components/PopularMovies';
import MovieDetails from './components/MovieDetails';
import NowPlayingMovies from './components/NowPlayingMovies';
import TopRatedMovies from './components/TopRatedMovies';
import SearchMovies from './components/SearchMovies';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/popular_movies" element={<PopularMovies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path='/now_playing' element={<NowPlayingMovies />} />
        <Route path='/top_rated' element={<TopRatedMovies />} />
        <Route path='/search' element={<SearchMovies />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route path='/login' element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
