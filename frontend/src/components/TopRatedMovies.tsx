import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Pager, ListCard } from '@freee_jp/vibes'
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

const TopRatedMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetch(`${config.apiUrl}/movies/top_rated?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results || [])
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [page])

  return (
    <div>
      <NavigationBar />
      <h2>評価の高い映画</h2>
      <ul style={gridContainerStyle}>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: '20px' }}>
            <CustomListCard
              title={movie.title}
              poster_path={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              id={movie.id}
            />
          </li>
        ))}
      </ul>
      <Pager
        currentPage={page}
        pageCount={totalPages}
        pageRange={5}
        sidePageRange={1}
        onPageChange={setPage}
        small={false}
      />
    </div>
  )
}

export default TopRatedMovies
