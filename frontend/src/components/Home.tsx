import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ListCard } from '@freee_jp/vibes'
import NavigationBar from './NavigationBar'
import config from '../config'

type Movie = {
  id: number
  title: string
  poster_path: string
}
const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '20px',
  listStyle: 'none',
  padding: 0
}

const cardStyle = {
  display: 'flex',
  alignItems: 'flex-start'
}

const imageStyle = {
  width: '90px',
  height: 'auto',
  marginRight: '20px'
}

const CustomListCard: React.FC<Movie & { poster_path: string }> = ({
  title,
  poster_path,
  id
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    navigate(`/movie/${id}`, { state: { from: location.pathname } })
  }

  return (
    <div style={cardStyle} onClick={handleClick}>
      <ListCard title={title} ma={0.5}>
        <img
          src={`https://image.tmdb.org/t/p/w300${poster_path}`}
          alt={title}
          style={imageStyle}
        />
      </ListCard>
    </div>
  )
}
const Home: React.FC = () => {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])

  const fetchMovies = async (
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<Movie[]>>
  ) => {
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      setState(data.results.slice(0, 7))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchMovies(`${config.apiUrl}/movies/upcoming`, setUpcomingMovies)
    fetchMovies(`${config.apiUrl}/movies/top_rated`, setTopRatedMovies)
  }, [])

  return (
    <div>
      <NavigationBar />
      <h1>ホームページ</h1>
      <section>
        <h2>近日公開の映画</h2>
        <div className="movies-row">
          <ul style={gridContainerStyle}>
            {upcomingMovies.map((movie) => (
              <li key={movie.id} style={{ marginBottom: '20px' }}>
                <CustomListCard
                  title={movie.title}
                  poster_path={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  id={movie.id}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section>
        <h2>評価が高い映画</h2>
        <div className="movies-row">
          <ul style={gridContainerStyle}>
            {topRatedMovies.map((movie) => (
              <li key={movie.id} style={{ marginBottom: '20px' }}>
                <CustomListCard
                  title={movie.title}
                  poster_path={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  id={movie.id}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
export default Home
