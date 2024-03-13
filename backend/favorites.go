package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)


type favoriteRequest struct {
    MovieID int `json:"movie_id"`
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
