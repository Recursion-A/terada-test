package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

type Movie struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	Overview   string `json:"overview"`
	PosterPath string `json:"poster_path"`
}

type ApiResponse struct {
	Results    []Movie `json:"results"`
	TotalPages int     `json:"total_pages"`
}

func GetPopularMoviesHandler(c echo.Context) error {
	apiKey := os.Getenv("TMDB_API_KEY")
	page := c.QueryParam("page")
	if page == "" {
		page = "1"
	}

	url := "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=ja-JP&page=" + page
	resp, err := http.Get(url)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch movies"})
	}
	defer resp.Body.Close()

	var apiResponse ApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to decode movies response"})
	}

	return c.JSON(http.StatusOK, apiResponse)
}

func GetMovieDetailsHandler(c echo.Context) error {
	apiKey := os.Getenv("TMDB_API_KEY")
	movieID := c.Param("id")

	url := "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + apiKey + "&language=ja-JP"
	resp, err := http.Get(url)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch movie details"})
	}
	defer resp.Body.Close()

	var movieDetails Movie
	if err := json.NewDecoder(resp.Body).Decode(&movieDetails); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to decode movie details response"})
	}

	return c.JSON(http.StatusOK, movieDetails)
}
