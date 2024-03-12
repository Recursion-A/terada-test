import React, { useState, useEffect } from 'react'
import { Pager, ListCard, SearchField } from '@freee_jp/vibes'
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
}) => (
  <div style={cardStyle}>
    <ListCard title={title} url={`movie/${id}`} ma={0.5}>
      <img
        src={`https://image.tmdb.org/t/p/w300${poster_path}`}
        alt={title}
        style={imageStyle}
      />
    </ListCard>
  </div>
)

const SearchMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [query, setQuery] = useState('検索')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchMovies = async () => {
      if (query) {
        const response = await fetch(
          `${config}/movies/search?query=${encodeURIComponent(query)}&page=${page}`
        )
        const data = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages)
      }
    }

    if (query) {
      fetchMovies().catch((error) =>
        console.error('Error fetching data:', error)
      )
    }
  }, [query, page])

  return (
    <div>
      <NavigationBar />
      <h2>映画検索</h2>
      <SearchField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for movies..."
      />
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
      {movies.length > 0 && (
        <Pager
          currentPage={page}
          pageCount={totalPages}
          pageRange={5}
          sidePageRange={1}
          onPageChange={setPage}
          small={false}
        />
      )}
    </div>
  )
}

export default SearchMovies
