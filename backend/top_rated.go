package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

type TopRatedApiResponse struct {
	Results    []NowPlayingMovie `json:"results"`
	TotalPages int               `json:"total_pages"`
}

type TopRatedMovie struct {
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	Overview      string `json:"overview"`
	Id            int    `json:"id"`
	PosterPath    string `json:"poster_path"`
	ReleaseDate   string `json:"release_date"`
}

func GetTopRatedMoviesHandler(c echo.Context) error {
	// クエリパラメーターからページ番号を取得
	page := c.QueryParam("page")
	if page == "" {
		page = "1" // デフォルトのページ番号を設定
	}

	apiKey := os.Getenv("TMDB_API_KEY")
	url := "https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=ja-JP&page=" + page

	resp, err := http.Get(url)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch movies"})
	}
	defer resp.Body.Close()

	var apiResponse TopRatedApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to decode movies response"})
	}

	return c.JSON(http.StatusOK, apiResponse)
}
