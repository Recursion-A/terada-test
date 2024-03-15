import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import config from '../config'
import NavigationBar from './NavigationBar'
import FavoriteButton from './FavoriteButton'

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  tagline: string
  runtime: number
}

const containerStyle = {
  width: '100vw'
}

const headingStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flexDirection: 'column',
  marginLeft: '40px'
}

const titleStyle: React.CSSProperties = {
  fontSize: '64px',
  borderBottom: '2px solid black',
  paddingBottom: '16px',
  fontWeight: 'bold'
}

const contentsStyle = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'start',
  gap: '120px',
  marginLeft: '40px'
}

const imageStyle: React.CSSProperties = {
  objectFit: 'contain'
}

const infoStyle = {
  width: '600px'
}

const contentTitle = {
  fontSize: '48px'
}

const contentText = {
  fontSize: '32px'
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!id) return
    fetch(`${config.apiUrl}/movies/details?id=${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => setMovie(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [id])

  const pageType = location.state.pageType

  if (!movie) return <div>Loading...</div>

  return (
    <div style={containerStyle}>
      <NavigationBar />
      <button onClick={() => navigate(-1)}>&lt;&lt;&#32;&#32;&#32;戻る</button>
      <div style={headingStyle}>
        <h2>{pageType}&#32;&#32;&#32;&gt;&gt;&#32;&#32;&#32;</h2>
        <p style={titleStyle}>{movie.title}</p>
      </div>
      <div style={contentsStyle}>
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            width={800}
            height={1200}
            style={imageStyle}
          />
        </div>
        <div style={infoStyle}>
          <div>
            <h2 style={contentTitle}>公開日</h2>
            <p style={contentText}>{movie.release_date}</p>
          </div>
          <div>
            <h2 style={contentTitle}>時間</h2>
            <p style={contentText}>{movie.runtime}分</p>
          </div>
          <div>
            <h2 style={contentTitle}>キャッチフレーズ</h2>
            <p style={contentText}>{movie.tagline}</p>
          </div>
          <div>
            <h2 style={contentTitle}>概要</h2>
            <p style={contentText}>{movie.overview}</p>
          </div>
        </div>
        {id && (
          <FavoriteButton
            movieId={Number(id)}
            movieTitle={movie.title}
            posterPath={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          />
        )}
      </div>
    </div>
  )
}

export default MovieDetails
