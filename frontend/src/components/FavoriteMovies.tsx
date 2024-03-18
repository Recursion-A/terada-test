import React, { useEffect, useState } from 'react'
import { ListCard } from '@freee_jp/vibes'
import NavigationBar from './NavigationBar'
import config from '../config'
import { isTokenValid } from '../Auth/authHelper'
import { useNavigate } from 'react-router-dom'

type Movie = {
  movie_id: number
  title: string
  image_url: string
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

const CustomListCard: React.FC<Movie & { image_url: string }> = ({
  title,
  image_url,
  movie_id
}) => (
  <div style={cardStyle}>
    <ListCard title={title} url={`movie/${movie_id}`} ma={0.5}>
      <img
        src={`https://image.tmdb.org/t/p/w300${image_url}`}
        alt={title}
        style={imageStyle}
      />
    </ListCard>
  </div>
)

const FavoriteMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  console.log(movies)
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token') // JWTトークンをローカルストレージから取得
    if (!token || !isTokenValid()) navigate('/login')

    fetch(`${config.apiUrl}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies(data || [])
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [navigate])

  return (
    <div>
      <NavigationBar />
      <h2>お気に入り映画</h2>
      <ul style={gridContainerStyle}>
        {movies.map((movie) => (
          <li key={movie.movie_id} style={{ marginBottom: '20px' }}>
            <CustomListCard
              title={movie.title}
              image_url={movie.image_url}
              movie_id={movie.movie_id}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FavoriteMovies
