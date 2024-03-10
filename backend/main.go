package main

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/api/movies/upcoming", GetUpcomingMoviesHandler)
	e.GET("/api/movies/now_playing", GetNowPlayingMoviesHandler)
	e.GET("/api/movies/top_rated", GetTopRatedMoviesHandler)
	e.GET("/api/movies/details", GetMovieDetailsHandler)
	e.GET("/api/movies/search", GetMovieSearchHandler)

	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "8080"
	}

	e.Logger.Fatal(e.Start(":" + httpPort))
}
