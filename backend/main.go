package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type Data struct {
	Message string `json:"message"`
}

func handleCORSAndMethod(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Content-Type", "application/json")
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	handleCORSAndMethod(w)

	data := Data{Message: "Hello from Go!"}
	json.NewEncoder(w).Encode(data)
}

func main() {
	router := mux.NewRouter()
	corsHeader := cors.Default().Handler(router)

	http.HandleFunc("/api/hello", helloHandler)

	fmt.Println("Server is listening on port 8080...")
	http.ListenAndServe(":8080", corsHeader)
}
