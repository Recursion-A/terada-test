import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>(); 
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!id) return; 
    fetch(`/api/movies/details?id=${id}`) 
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setMovie(data))
      .catch(error => console.error("Error fetching data:", error));
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <h1>{movie.title}</h1>
      <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
      <p>{movie.overview}</p>
    </div>
  );
}

export default MovieDetails;
