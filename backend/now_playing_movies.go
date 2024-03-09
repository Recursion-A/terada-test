package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type NowPlayingApiResponse struct {
	Results    []NowPlayingMovie `json:"results"`
	TotalPages int               `json:"total_pages"`
}

type NowPlayingMovie struct {
	Title         string `json:"title"`
	OriginalTitle string `json:"original_title"`
	Overview      string `json:"overview"`
	Id            int    `json:"id"`
	PosterPath    string `json:"poster_path"`
	ReleaseDate   string `json:"release_date"`
}

func GetNowPlayingMoviesHandler(w http.ResponseWriter, r *http.Request) {
	// クエリパラメーターからページ番号を取得
	pageNumber := r.URL.Query().Get("page")
	if pageNumber == "" {
		pageNumber = "1" // デフォルトのページ番号を設定
	}

	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/movie/now_playing?api_key=%s&language=ja-JP&page=%s", apiKey, pageNumber)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var apiResponse NowPlayingApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		http.Error(w, "Failed to decode movies response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResponse.Results)
}

func GetTotalPagesHandler(w http.ResponseWriter, r *http.Request) {
	apiKey := os.Getenv("TMDB_API_KEY")
	url := fmt.Sprintf("https://api.themoviedb.org/3/movie/now_playing?api_key=%s&language=ja-JP", apiKey)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch total pages", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var apiResponse NowPlayingApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		http.Error(w, "Failed to decode  total pages response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(apiResponse.TotalPages)
}
