import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import config from '../config'
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

type Review = {
  id: number
  user_id: number
  movie_id: number
  rating: number
  text: string
}

type ReviewDetail = {
  review: Review
  movie_title: string
  image_url: string
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  width: '1280px',
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

const reviewSectionStyle = {
  marginTop: '20px'
}

const reviewTitleStyle = {
  fontSize: '24px',
  marginBottom: '15px'
}

const reviewItemStyle = {
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
  marginBottom: '10px'
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<ReviewDetail[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/movies/details?id=${id}`)
        if (!response.ok) throw new Error('映画の詳細の取得に失敗しました。')
        const movieData = await response.json()
        setMovie(movieData)
      } catch (error) {
        console.error('Error fetching movie details:', error)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${config.apiUrl}/reviews/movie?movieId=${id}`
        )
        if (!response.ok) throw new Error('レビューの取得に失敗しました。')
        const data = await response.json()
        if (Array.isArray(data)) {
          setReviews(data)
        } else {
          console.error('Received data is not an array:', data)
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
      }
    }

    if (id) {
      fetchMovieDetails()
      fetchReviews()
    }
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
          <button
            style={buttonStyle}
            onClick={() => navigate(`/movie/${movie.id}/review`)}
          >
            レビュー
          </button>
          {id && (
            <FavoriteButton
              movieId={Number(id)}
              movieTitle={movie.title}
              posterPath={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            />
          )}
        </div>
      </div>
      <div style={reviewSectionStyle}>
        <h2 style={reviewTitleStyle}>レビュー</h2>
        <div>
          {reviews.length > 0 ? (
            reviews.map((review: ReviewDetail) => (
              <div key={review.review.id} style={reviewItemStyle}>
                <div>Rating: {review.review.rating}</div>
                <div>{review.review.text}</div>
              </div>
            ))
          ) : (
            <p>レビューはまだありません。</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
