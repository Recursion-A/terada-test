package main

import (
	"log"
	"net/http"
	"strconv"

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

	_, err = db.Exec("INSERT INTO favorites (user_id, movie_id) VALUES (?, ?)", userId, req.MovieID)

	if err != nil {
		log.Printf("Failed to add favorite: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to add favorite"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Favorite added successfully"})
}

// お気に入り削除のエンドポイント
func removeFavorite(c echo.Context) error {
	var req favoriteRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid request"})
	}

	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	_, err = db.Exec("DELETE FROM favorites WHERE user_id = ? AND movie_id = ?", userId, req.MovieID)
	if err != nil {
		log.Printf("Failed to remove favorite: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to remove favorite"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Favorite removed successfully"})
}

func GetFavoriteMovies(c echo.Context) error {
	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	var favorites []favoriteRequest
	rows, err := db.Query(`
		SELECT f.movie_id, m.title, m.poster_path 
		FROM favorites AS f 
		JOIN movies AS m ON f.movie_id = m.id 
		WHERE f.user_id = ?`, userId)
	if err != nil {
		log.Printf("Error querying favorite movies: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve favorite movies"})
	}
	defer rows.Close()

	for rows.Next() {
		var fm favoriteRequest
		if err := rows.Scan(&fm.MovieID, &fm.Title, &fm.ImageURL); err != nil {
			log.Printf("Error scanning favorite movies: %v", err)
			continue
		}
		favorites = append(favorites, fm)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating favorite movies: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error retrieving favorite movies"})
	}

	return c.JSON(http.StatusOK, favorites)
}
func GetIsFavorite(c echo.Context) error {

    // JWTトークンからユーザーIDを取得
    userId, err := getUserIdFromToken(c)
    if err != nil {
        return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
    }

	movieIdParam := c.QueryParam("movieId")
	movieId, err := strconv.Atoi(movieIdParam)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid movie ID"})
	}
	var exists bool
    err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = ? AND movie_id = ?)", userId, movieId).Scan(&exists)
    if err != nil {
        log.Printf("Error querying favorites: %v", err)
        return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to query favorite status"})
    }

    // 結果をJSON形式でレスポンスとして返す
    return c.JSON(http.StatusOK, map[string]bool{"isFavorite": exists})
}
