package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

// DB接続情報
// 要env行き
const (
	dbUser     = "root"
	dbPassword = "root"
	dbName     = "react-go-app"
)

var db *sql.DB

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func signup(c echo.Context) error {
	u := new(User)
	if err := c.Bind(u); err != nil {
		return err
	}

	// パスワードハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// ユーザー情報をDBに保存
	_, err = db.Exec("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", u.Username, u.Email, hashedPassword)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Signup successful"})
}

var jwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

// JWTクレーム構造体
type Claims struct {
	UserID   int    `json:"userId"`
	Username string `json:"username"`
	jwt.StandardClaims
}

// ログインエンドポイント
func login(c echo.Context) error {
	u := new(User)
	if err := c.Bind(u); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request payload"})
	}

	// DBからユーザー情報を取得
	var userID int
	var user User
	var passwordHash string
	err := db.QueryRow("SELECT id, username, password_hash FROM users WHERE username = ?", u.Username).Scan(&userID, &user.Username, &passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password", "providedPassword": u.Password, "storedPasswordHash": "N/A"})
		}
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(u.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid username or password", "providedPassword": u.Password, "storedPasswordHash": passwordHash})
	}
	// JWTトークンの生成
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		UserID:   userID,
		Username: u.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return err
	}

	// JWTトークンをレスポンスとして返す
	return c.JSON(http.StatusOK, map[string]string{
		"token": tokenString,
	})
}

// JWTからユーザーIDを取得するヘルパー関数
func getUserIdFromToken(c echo.Context) (int, error) {
	tokenString := c.Request().Header.Get("Authorization")
	if tokenString == "" {
		return 0, fmt.Errorf("authorization header is missing")
	}

	// Bearerトークンから実際のトークン文字列を取得
	tokenString = strings.TrimPrefix(tokenString, "Bearer ")

	// トークンの解析と検証
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// ここで署名の検証に使う秘密鍵を返します。
		return jwtKey, nil
	})
	if err != nil {
		return 0, err
	}

	// トークンのClaims部分を独自のClaims型として取得
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return 0, fmt.Errorf("token is invalid")
	}

	return claims.UserID, nil
}
