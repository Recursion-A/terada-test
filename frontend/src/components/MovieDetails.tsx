import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FloatingBase } from '@freee_jp/vibes'

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  tagline: string
  runtime: number
}

const titleStyle = {
  borderBottom: 'solid 2px black'
}

const imageStyle = {
  border: 'solid 4px black'
}

const infoStyle = {
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  gap: '24px'
}

const overviewStyle = {
  marginTop: '24px',
  width: '400px',
  border: 'solid 2px black',
  borderRadius: '20px',
  padding: '8px'
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/movies/details?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setMovie(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [id])

  if (!movie) return <div>Loading...</div>

  return (
    <FloatingBase>
      <h1 style={titleStyle}>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        style={imageStyle}
      />
      <div style={infoStyle}>
        <div style={overviewStyle}>
          <h2>公開日</h2>
          <p>{movie.release_date}</p>
        </div>
        <div style={overviewStyle}>
          <h2>時間</h2>
          <p>{movie.runtime}分</p>
        </div>
        <div style={overviewStyle}>
          <h2>キャッチフレーズ</h2>
          <p>{movie.tagline}</p>
        </div>
        <div style={overviewStyle}>
          <h2>概要</h2>
          <p>{movie.overview}</p>
        </div>
      </div>
    </FloatingBase>
  )
}

export default MovieDetails
