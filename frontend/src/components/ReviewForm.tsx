import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import config from '../config'
import NavigationBar from './NavigationBar'
import StarRating from './StarRating'

type RouteParams = {
  id: string
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
}

const contentsStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'start',
  gap: '40px'
}

const headingStyle = {
  fontSize: '64px',
  fontWeight: 'bold'
}

const textStyle = {
  fontSize: '40px',
  fontWeight: 'bold'
}

const textareaStyle = {
  padding: '4px',
  border: '2px solid black',
  borderRadius: 0,
  outline: 'none',
  background: 'none',
  fontSize: '32px'
}

const buttonStyle = {
  fontSize: '24px',
  margin: '0 auto'
}

const ReviewForm = () => {
  const [selectedStars, setSelectedStars] = useState(0)
  const [text, setText] = useState('')

  const { id: movieId } = useParams<RouteParams>()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(selectedStars)

    const token = localStorage.getItem('token')

    const reviewData = {
      movie_id: parseInt(movieId!, 10),
      rating: selectedStars,
      text: text
    }

    try {
      const response = await fetch(`${config.apiUrl}/reviews/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        navigate(`/movie/${movieId}`)
      } else {
        alert('レビューの投稿に失敗しました')
      }
    } catch (error) {
      console.error(`error: Add review failed: ${error}`)
    }
  }

  return (
    <div style={containerStyle}>
      <NavigationBar />
      <p style={headingStyle}>Movie Review</p>
      <form onSubmit={handleSubmit}>
        <div style={contentsStyle}>
          <div>
            <StarRating
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
            />
          </div>
          <div>
            <p style={textStyle}>Review</p>
            <textarea
              id="reviewText"
              name="reviewText"
              value={text}
              style={textareaStyle}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
        </div>
        <button style={buttonStyle} type="submit">
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
