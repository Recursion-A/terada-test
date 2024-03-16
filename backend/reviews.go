package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type Review struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	MovieID   int64     `json:"movie_id"`
	Rating    int64     `json:"rating"`
	Text      string    `json:"text"`
}

type ReviewRequest struct {
	MovieID int64  `json:"movie_id"`
	Rating  int64  `json:"rating"`
	Text    string `json:"text"`
}

type ReviewDetail struct {
	Review     Review `json:"review"`
	MovieTitle string `json:"movie_title"`
	ImageURL   string `json:"image_url"`
}

func addReview(c echo.Context) error {
	var req ReviewRequest

	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	_, err = db.Exec("INSERT INTO reviews (user_id, movie_id, rating, text) VALUES (?, ?, ?, ?)", userId, req.MovieID, req.Rating, req.Text)

	if err != nil {
		log.Printf("Failed to add review: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to add the review"})
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "Review added successfully"})
}

func GetReviewsFromMovieId(c echo.Context) error {
	movieId := c.QueryParam("movieId")
	var movieIdInt int
	movieIdIntTemp, err := strconv.Atoi(movieId)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid movieId parameter"})
	}
	movieIdInt = int(movieIdIntTemp)

	var reviewDetails []ReviewDetail
	query := `
		SELECT r.id, r.user_id, r.movie_id, r.rating, r.text, m.title, m.poster_path
		FROM reviews r
		JOIN movies m ON r.movie_id = m.id
		WHERE r.movie_id = ?
	`
	rows, err := db.Query(query, movieIdInt)
	if err != nil {
		log.Printf("Error querying reviews: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve reviews"})
	}
	defer rows.Close()

	for rows.Next() {
		var rd ReviewDetail
		var r Review
		if err := rows.Scan(&r.ID, &r.UserID, &r.MovieID, &r.Rating, &r.Text, &rd.MovieTitle, &rd.ImageURL); err != nil {
			log.Printf("Error scanning review detail: %v", err)
			return err
		}
		rd.Review = r
		reviewDetails = append(reviewDetails, rd)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating reviews: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error retrieving reviews"})
	}

	return c.JSON(http.StatusOK, reviewDetails)
}

func getReviewsFromUserId(c echo.Context) error {
	userId, err := getUserIdFromToken(c)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"message": "Invalid user token"})
	}

	var reviewDetails []ReviewDetail
	query := `
		SELECT r.id, r.user_id, r.movie_id, r.rating, r.text, m.title, m.poster_path
		FROM reviews r
		JOIN movies m ON r.movie_id = m.id
		WHERE r.user_id = ?
	`
	rows, err := db.Query(query, userId)
	if err != nil {
		log.Printf("Error querying reviews: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Failed to retrieve reviews"})
	}
	defer rows.Close()

	for rows.Next() {
		var rd ReviewDetail
		var r Review
		if err := rows.Scan(&r.ID, &r.UserID, &r.MovieID, &r.Rating, &r.Text, &rd.MovieTitle, &rd.ImageURL); err != nil {
			log.Printf("Error scanning review detail: %v", err)
			return err
		}
		rd.Review = r
		reviewDetails = append(reviewDetails, rd)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating reviews: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"message": "Error retrieving reviews"})
	}

	return c.JSON(http.StatusOK, reviewDetails)
}
