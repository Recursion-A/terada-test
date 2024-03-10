import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UpcomingMovies from './components/UpcomingMovies';
import MovieDetails from './components/MovieDetails';
import NowPlayingMovies from './components/NowPlayingMovies';
import TopRatedMovies from './components/TopRatedMovies';
import SearchMovies from './components/SearchMovies';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upcoming" element={<UpcomingMovies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path='/now_playing' element={<NowPlayingMovies />} />
        <Route path='/top_rated' element={<TopRatedMovies />} />
        <Route path='/search' element={<SearchMovies />} />
      </Routes>
    </Router>
  );
}

export default App;
