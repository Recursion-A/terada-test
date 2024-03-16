import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import config from '../config'

type RouteParams = {
  id: string
}

const ReviewForm = () => {
  const [rating, setRating] = useState('')
  const [text, setText] = useState('')

  const { id: movieId } = useParams<RouteParams>()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    const reviewData = {
      movie_id: parseInt(movieId!, 10),
      rating: parseInt(rating, 10),
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
    <form onSubmit={handleSubmit}>
      <h2>Movie Review</h2>
      <div>
        <label>
          Rating:
          <input
            type="number"
            value={rating}
            id="rating"
            name="rating"
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </label>
      </div>
      <div>
        <label>
          Review:
          <textarea
            id="reviewText"
            name="reviewText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  )
}

export default ReviewForm
