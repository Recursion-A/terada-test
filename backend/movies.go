package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/labstack/echo/v4"
)

type Movie struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Overview    string `json:"overview"`
	PosterPath  string `json:"poster_path"`
	ReleaseDate string `json:"release_date"`
	Tagline     string `json:"tagline"`
	Runtime     int    `json:"runtime"`
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
	movieID := c.QueryParam("id")
	apiKey := os.Getenv("TMDB_API_KEY")

	if movieID == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Movie ID is required"})
	}

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

func GetMovieSearchHandler(c echo.Context) error {
	apiKey := os.Getenv("TMDB_API_KEY")
	query := c.QueryParam("query")
	page := c.QueryParam("page")
	if page == "" {
		page = "1"
	}

	encodedQuery := url.QueryEscape(query)

	url := fmt.Sprintf("https://api.themoviedb.org/3/search/movie?query=%s&include_adult=false&language=ja-JP&page=%s&api_key=%s", encodedQuery, page, apiKey)
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

func GetMoviesForHomePage(c echo.Context) error {
	apiKey := os.Getenv("TMDB_API_KEY")
	popularMoviesURL := fmt.Sprintf("https://api.themoviedb.org/3/movie/popular?api_key=%s&language=ja-JP&page=1", apiKey)
	topRatedMoviesURL := fmt.Sprintf("https://api.themoviedb.org/3/movie/top_rated?api_key=%s&language=ja-JP&page=1", apiKey)

	popularMovies, _ := fetchMovies(popularMoviesURL)
	topRatedMovies, _ := fetchMovies(topRatedMoviesURL)

	return c.JSON(http.StatusOK, echo.Map{
		"popular_movies":   popularMovies.Results[:7],
		"top_rated_movies": topRatedMovies.Results[:7],
	})
}

func fetchMovies(url string) (*ApiResponse, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var apiResponse ApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, err
	}

	return &apiResponse, nil
}
