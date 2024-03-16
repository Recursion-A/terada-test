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
  const location = useLocation()

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
                  <button
            style={buttonStyle}
            onClick={() => navigate(`/movie/${movie.id}/review`)}
          >
            レビュー
          </button>
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
          {id && <FavoriteButton movieId={Number(id)} />}
      </div>
    </div>
  )
}

export default MovieDetails
