import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

interface Movie {
  id: number
  title: string
  poster_path: string
  overview: string
  release_date: string
  tagline: string
  runtime: number
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  width: '1080px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  border: 'solid 4px black',
  borderRadius: '20px',
  padding: '16px'
}

const titleStyle = {
  borderBottom: 'solid 2px black'
}

const imageStyle = {
  border: 'solid 4px black'
}

const rightContentsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}

const infoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '24px'
}

const overviewStyle: React.CSSProperties = {
  marginTop: '24px',
  width: '240px',
  height: '120px',
  border: 'solid 2px black',
  padding: '4px 8px',
  overflowY: 'scroll'
}

const buttonContainerStyle = {
  width: '120px',
  height: '80px',
  border: 'solid 4px black',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '40px'
}

const buttonStyle = {
  width: '100%',
  height: '100%',
  fontSize: '24px'
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)

  const navigate = useNavigate()

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
    <div style={containerStyle}>
      <div>
        <h1 style={titleStyle}>{movie.title}</h1>
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          style={imageStyle}
        />
      </div>
      <div style={rightContentsStyle}>
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
        <div style={buttonContainerStyle}>
          <button style={buttonStyle} onClick={() => navigate(-1)}>
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
