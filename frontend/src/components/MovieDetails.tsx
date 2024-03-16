import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

const titleStyle: React.CSSProperties = {
  fontSize: '64px',
  borderBottom: '2px solid black',
  paddingBottom: '16px',
  fontWeight: 'bold',
  margin: '40px 0'
}

const headingStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  flexDirection: 'column',
  marginTop: '24px',
  marginLeft: '40px'
}

const buttonResetStyle = {
  padding: 0,
  border: 'none',
  outline: 'none',
  font: 'inherit',
  color: 'inherit',
  background: 'none',
  fontSize: '32px',
  fontWeight: 'bold'
}

const reviewButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0',
  right: '10%'
}

const contentsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'start',
  gap: '120px',
  width: '80%',
  margin: '0 auto',
  position: 'relative'
}

const descriptionStyle: React.CSSProperties = {
  fontSize: '32px',
  overflowY: 'scroll',
  maxHeight: '240px'
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

const reviewTitleStyle: React.CSSProperties = {
  fontSize: '64px',
  borderBottom: '2px solid black',
  paddingBottom: '16px',
  fontWeight: 'bold',
  margin: '0 0 40px 40px',
  display: 'inline-block',
}

const reviewContainerStyle: React.CSSProperties = {
  width: '1320px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '40px'
}

const reviewBoxStyle = {
  border: '2px solid black',
  width: '400px',
  borderRadius: '20px',
  padding: '4px'
}

const reviewRatingStyle = {
  fontSize: '40px',
  fontWeight: 'bold'
}

const reviewTextWrapStyle: React.CSSProperties = {
  height: '120px',
  width: '80%',
  overflowY: 'scroll',
  margin: '0 auto'
}

const reviewTextStyle: React.CSSProperties = {
  fontSize: '24px',
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<ReviewDetail[]>([])

  const navigate = useNavigate()
  // const location = useLocation()

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
          setReviews([])
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

  // const pageType = location.state.pageType

  if (!movie) return <div>Loading...</div>

  return (
    <div style={containerStyle}>
      <NavigationBar />
      <div style={headingStyle}>
        <button style={buttonResetStyle} onClick={() => navigate(-1)}>
          &lt;&lt;&#32;&#32;&#32;&#32;&#32;&#32;{pageType}
        </button>
        <p style={titleStyle}>{movie.title}</p>
      </div>
      <div style={contentsStyle}>
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            width={600}
            height={1000}
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
            <p style={descriptionStyle}>{movie.overview}</p>
          </div>
        </div>
        <button
          style={reviewButtonStyle}
          onClick={() => navigate(`/movie/${movie.id}/review`)}
        >
          レビューを書く
        </button>
        {id && (
          <FavoriteButton
            movieId={Number(id)}
            movieTitle={movie.title}
            posterPath={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          />
        )}
      </div>
      <div style={reviewSectionStyle}>
        <h2 style={reviewTitleStyle}>レビュー</h2>
        <div style={reviewContainerStyle}>
          {reviews.length > 0 ? (
            reviews.map((review: ReviewDetail) => (
              <div key={review.review.id} style={reviewBoxStyle}>
                <div>
                  <p style={reviewRatingStyle}>
                    Rating: {review.review.rating}/5
                  </p>
                </div>
                <div style={reviewTextWrapStyle}>
                  <p style={reviewTextStyle}>{review.review.text}</p>
                </div>
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
