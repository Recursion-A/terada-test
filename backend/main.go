package main

import (
	"log"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {
	// .envファイルから環境変数を読み込む
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	http.HandleFunc("/api/movies/popular", GetPopularMoviesHandler)

	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
