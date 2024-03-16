import { FaStar } from 'react-icons/fa'

interface StarRatingProps {
  selectedStars: number
  setSelectedStars: React.Dispatch<React.SetStateAction<number>>
}

const textStyle = {
  fontSize: '40px',
  fontWeight: 'bold'
}

const starStyle = {
  cursor: 'pointer',
  fontSize: '64px'
}

const StarRating: React.FC<StarRatingProps> = ({
  selectedStars,
  setSelectedStars
}) => {
  const totalStars = 5

  const handleStarClick = (index: number) => {
    setSelectedStars(index + 1)
  }

  return (
    <div>
      <p style={textStyle}>Rating</p>
      {[...Array(totalStars)].map((_, index) => (
        <FaStar
          key={index}
          onClick={() => handleStarClick(index)}
          color={selectedStars > index ? '#ffc107' : '#e4e5e9'}
          style={starStyle}
        />
      ))}
      <p style={textStyle}>
        {selectedStars} / {totalStars}
      </p>
    </div>
  )
}

export default StarRating
