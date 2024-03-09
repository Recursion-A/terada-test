package main

import (
	"encoding/json"
	"net/http"
	"os"
)

type ApiResponse struct {
	Results    []Movie `json:"results"`
	TotalPages int     `json:"total_pages"`
}

type Movie struct {
	ID         int    `json:"id"`
	Title      string `json:"title"`
	Overview   string `json:"overview"`
	PosterPath string `json:"poster_path"`
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func GetPopularMoviesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	apiKey := os.Getenv("TMDB_API_KEY")
	page := r.URL.Query().Get("page") // クエリパラメータからページ番号を取得
	if page == "" {
		page = "1" // デフォルトのページ番号を設定
	}

	url := "https://api.themoviedb.org/3/movie/popular?api_key=" + apiKey + "&language=ja-JP&page=" + page

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var apiResponse ApiResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		http.Error(w, "Failed to decode movies response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	// `apiResponse`をそのままエンコードする
	if err := json.NewEncoder(w).Encode(apiResponse); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
