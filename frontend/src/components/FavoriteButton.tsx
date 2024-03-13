import { useState } from "react";
interface FavoriteButtonProps {
    movieId: number;
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleAddFavorite = async () => {
        const token = localStorage.getItem('token'); // JWTトークンをローカルストレージから取得
        try {
            const response = await fetch('/api/favorites/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // トークンをヘッダーにセット
                },
                body: JSON.stringify({ movie_id: movieId }),
            });
            if (response.ok) {
                setIsFavorite(true);
                alert('お気に入りに追加しました。');
            } else {
                alert('お気に入りの追加に失敗しました。');
            }
        } catch (error) {
            console.error('Add favorite failed:', error);
        }
    };

    const handleRemoveFavorite = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/favorites/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movie_id: movieId }),
            });
            if (response.ok) {
                setIsFavorite(false);
                alert('お気に入りから削除しました。');
            } else {
                alert('お気に入りの削除に失敗しました。');
            }
        } catch (error) {
            console.error('Remove favorite failed:', error);
        }
    };

    return (
        <div>
            {isFavorite ? (
                <button onClick={handleRemoveFavorite}>お気に入りから削除</button>
            ) : (
                <button onClick={handleAddFavorite}>お気に入りに追加</button>
            )}
        </div>
    );
};

export default FavoriteButton;
