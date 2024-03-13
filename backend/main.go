package main

import (
    "database/sql"
    "fmt"
    "os"

    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
)

func main() {
    var err error
    db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(mysql_container:3306)/%s", dbUser, dbPassword, dbName))
    if err != nil {
        panic(err)
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

    httpPort := os.Getenv("PORT")
    if httpPort == "" {
        httpPort = "8080"
    }

    e.Logger.Fatal(e.Start(":" + httpPort))
}
