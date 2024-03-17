import React, { useState, useEffect } from 'react'
import NavigationBar from './NavigationBar'
import { Pager, ListCard } from '@freee_jp/vibes'
import config from '../config'
import { isTokenValid } from '../Auth/authHelper'
import { useNavigate } from 'react-router-dom'

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

const CustomListCard: React.FC<ReviewDetail> = ({
  review,
  movie_title,
  image_url
}) => (
  <div style={cardStyle}>
    <ListCard title={movie_title} url={`movie/${review.movie_id}`} ma={0.5}>
      <img
        src={`https://image.tmdb.org/t/p/w300${image_url}`}
        alt={movie_title}
        style={imageStyle}
      />
    </ListCard>
  </div>
)

const ReviewMovies = () => {
  const [reviewDetails, setReviewDetails] = useState<ReviewDetail[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || !isTokenValid()) navigate("/login")
    
    fetch(`${config.apiUrl}/reviews`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setReviewDetails(data || [])
        setTotalPages(Math.ceil(data.length / 20))
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [navigate])

  return (
    <div>
      <NavigationBar />
      <h2>お気に入り映画</h2>
      <ul style={gridContainerStyle}>
        {reviewDetails.map((reviewDetail: ReviewDetail) => (
          <li
            key={reviewDetail.review.movie_id}
            style={{ marginBottom: '20px' }}
          >
            <CustomListCard
              review={reviewDetail.review}
              movie_title={reviewDetail.movie_title}
              image_url={reviewDetail.image_url}
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

export default ReviewMovies
