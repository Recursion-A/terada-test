import { useEffect, useState } from 'react'

interface FavoriteButtonProps {
  movieId: number
  movieTitle: string
  posterPath: string
}

const favoriteButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0',
  right: '25%'
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null)

  const handleAddFavorite = async () => {
    const token = localStorage.getItem('token') // JWTトークンをローカルストレージから取得
    try {
      const response = await fetch('/api/favorites/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}` // トークンをヘッダーにセット
        },
        body: JSON.stringify({
          movie_id: movieId
        })
      })
      if (response.ok) {
        setIsFavorite(true)
        alert('お気に入りに追加しました。')
      } else {
        alert('お気に入りの追加に失敗しました。')
      }
    } catch (error) {
      console.error('Add favorite failed:', error)
    }
  }

  useEffect(() => {
    const checkIsFavorite = async () => {
      const token = localStorage.getItem('token') // JWTトークンをローカルストレージから取得
      if (!token) {
        console.error('Token not found')
        return
      }

      try {
        const response = await fetch(
          `/api/favorites/is_favorite?movieId=${movieId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setIsFavorite(data.isFavorite)
      } catch (error) {
        console.error('Error fetching favorite status:', error)
      }
    }

    checkIsFavorite()
  }, [movieId])

  const handleRemoveFavorite = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/favorites/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movie_id: movieId
        })
      })
      if (response.ok) {
        setIsFavorite(false)
        alert('お気に入りから削除しました。')
      } else {
        alert('お気に入りの削除に失敗しました。')
      }
    } catch (error) {
      console.error('Remove favorite failed:', error)
    }
  }

  return (
    <div>
      {isFavorite ? (
        <button style={favoriteButtonStyle} onClick={handleRemoveFavorite}>
          お気に入りから削除
        </button>
      ) : (
        <button style={favoriteButtonStyle} onClick={handleAddFavorite}>
          お気に入りに追加
        </button>
      )}
    </div>
  )
}

export default FavoriteButton
