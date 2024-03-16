package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db, err := connectDB()
	if err != nil {
		log.Printf("Failed to open database: %v", err)
	}
	defer db.Close()

	e := echo.New()
	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Public routes
	e.POST("/api/signup", signup)
	e.POST("/api/login", login)
	e.GET("/api/movies/upcoming", GetUpcomingMoviesHandler)
	e.GET("/api/movies/now_playing", GetNowPlayingMoviesHandler)
	e.GET("/api/movies/top_rated", GetTopRatedMoviesHandler)
	e.GET("/api/movies/details", GetMovieDetailsHandler)
	e.GET("/api/movies/search", GetMovieSearchHandler)
	e.GET("/api/favorites", GetFavoriteMovies)
	e.GET("/api/reviews/movie", GetReviewsFromMovieId)

	// JWT Middleware setup for restricted routes
	jwtMiddleware := middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey:  []byte(os.Getenv("JWT_SECRET_KEY")),
		TokenLookup: "header:Authorization",
		AuthScheme:  "Bearer",
	})

	// Restricted routes with JWT Middleware
	r := e.Group("/api/favorites")
	r.Use(jwtMiddleware)
	r.POST("/add", addFavorite)
	r.POST("/remove", removeFavorite)

	root := e.Group("/api/reviews")
	root.Use(jwtMiddleware)
	root.POST("/add", addReview)
	root.GET("", getReviewsFromUserId)

	httpPort := os.Getenv("PORT")
	if httpPort == "" {
		httpPort = "8080"
	}
	e.Logger.Fatal(e.Start(":" + httpPort))
}

func connectDB() (*sql.DB, error) {
	var err error
	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(mysql_container:3306)/%s?charset=utf8mb4&parseTime=true", dbUser, dbPassword, dbName))
	if err != nil {
		return nil, err
	}
	return db, nil
}
