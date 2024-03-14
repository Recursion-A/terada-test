package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type favoriteRequest struct {
	MovieID  int    `json:"movie_id"`
	Title    string `json:"title"`
	ImageURL string `json:"image_url"`
}

func addFavorite(c echo.Context) error {
	var req favoriteRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	_, err = db.Exec("INSERT INTO favorites (user_id, movie_id, title, image_url) VALUES (?, ?, ?, ?)", userId, req.MovieID, req.Title, req.ImageURL)
	if err != nil {
		log.Printf("Failed to add favorite: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to add favorite"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Favorite added successfully"})
}

// お気に入り削除のエンドポイント
func removeFavorite(c echo.Context) error {
	var req favoriteRequest
	// リクエストボディからJSONを解析し、favoriteRequest構造体にバインドします。
	if err := c.Bind(&req); err != nil {
		// バインドに失敗した場合は、クライアントに400 Bad Requestを返します。
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	// JWTトークンからユーザーIDを取得します。
	userId, err := getUserIdFromToken(c)
	if err != nil {
		// トークンが無効な場合は、クライアントに400 Bad Requestを返します。
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	// 指定された映画IDとユーザーIDを使用して、favoritesテーブルからエントリを削除します。
	_, err = db.Exec("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?", userId, req.MovieID)
	if err != nil {
		// SQL実行に失敗した場合は、サーバー側のログに記録し、クライアントに500 Internal Server Errorを返します。
		log.Printf("Failed to remove favorite: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to remove favorite"})
	}

	// 成功した場合は、クライアントに200 OKを返します。
	return c.JSON(http.StatusOK, map[string]string{"message": "Favorite removed successfully"})
}

func GetFavoriteMovies(c echo.Context) error {
	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	// ユーザーIDに紐づくお気に入り映画のリストを取得するSQLクエリ
	var favorites []favoriteRequest
	rows, err := db.Query("SELECT movie_id, title, image_url FROM favorites WHERE user_id = ?", userId)
	if err != nil {
		log.Printf("Error querying favorite movies: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve favorite movies"})
	}
	defer rows.Close()

	for rows.Next() {
		var fm favoriteRequest
		if err := rows.Scan(&fm.MovieID, &fm.Title, &fm.ImageURL); err != nil {
			log.Printf("Error scanning favorite movies: %v", err)
			continue // エラーが発生しても次の行の処理を続ける
		}
		favorites = append(favorites, fm)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating favorite movies: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error retrieving favorite movies"})
	}

	// 取得したお気に入り映画のリストをJSON形式でレスポンスとして返す
	return c.JSON(http.StatusOK, favorites)
}