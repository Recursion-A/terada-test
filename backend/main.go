package main

import (
	"fmt"
	"net/http"
	"encoding/json"
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
	http.HandleFunc("/api/hello", helloHandler)

	fmt.Println("Server is listening on port 8080...")
	http.ListenAndServe(":8080", nil)
}
