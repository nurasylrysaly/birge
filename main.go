package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type GymMember struct {
	ID       primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Name     string             `json:"name,omitempty" bson:"name,omitempty"`
	Age      int                `json:"age,omitempty" bson:"age,omitempty"`
	Gender   string             `json:"gender,omitempty" bson:"gender,omitempty"`
	Email    string             `json:"email,omitempty" bson:"email,omitempty"`
	JoinDate time.Time          `json:"joinDate"`
}

var client *mongo.Client

func main() {
	// Connect to the MongoDB database
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	var err error
	client, err = mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	
	// Create MongoDB client
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Connect to MongoDB server
	err = client.Connect(context.Background())
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	router := mux.NewRouter()

	router.HandleFunc("/members", getMembers).Methods("GET")
	router.HandleFunc("/members", createMember).Methods("POST")
	router.HandleFunc("/members/{id}", getMemberByID).Methods("GET")
	router.HandleFunc("/members/{id}", updateMember).Methods("PUT")
	router.HandleFunc("/members/{id}", deleteMember).Methods("DELETE")
	router.HandleFunc("/signup", handleSignup).Methods("POST")
	router.HandleFunc("/login", handleLogin).Methods("POST")
	router.HandleFunc("/schedule", getSchedule).Methods("GET")
	router.HandleFunc("/schedule", createSchedule).Methods("POST")
	router.HandleFunc("/schedule/{id}", updateSchedule).Methods("PUT")
	router.HandleFunc("/schedule/{id}", deleteSchedule).Methods("DELETE")
	router.HandleFunc("/api/upload", handleFileUpload).Methods("POST")
	router.HandleFunc("/api/download/{id}", handleFileDownload).Methods("GET")
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./build/")))
	

	log.Println("Server started on port 8081")
	log.Fatal(http.ListenAndServe(":8081	", router))
}

func getMembers(w http.ResponseWriter, r *http.Request) {

	collection := client.Database("fitnesscenter").Collection("members")

	cur, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.Background())

	var members []GymMember
	for cur.Next(context.Background()) {
		var member GymMember
		err := cur.Decode(&member)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		members = append(members, member)
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(members)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func createMember(w http.ResponseWriter, r *http.Request) {

	var member GymMember
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	member.JoinDate = time.Now()

	collection := client.Database("fitnesscenter").Collection("members")
	_, err = collection.InsertOne(context.Background(), member)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(member)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func getMemberByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, _ := primitive.ObjectIDFromHex(params["id"])
	filter := bson.M{"_id": id}
	var member GymMember
	err := client.Database("fitnesscenter").Collection("members").FindOne(context.Background(), filter).Decode(&member)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}
	json.NewEncoder(w).Encode(member)
}
func deleteMember(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid member ID", http.StatusBadRequest)
		return
	}

	collection := client.Database("fitnesscenter").Collection("members")
	filter := bson.M{"_id": id}
	result, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Failed to delete member", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Member not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Member deleted successfully"})
}

func updateMember(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid member ID", http.StatusBadRequest)
		return
	}

	var member GymMember
	err = json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	collection := client.Database("fitnesscenter").Collection("members")
	filter := bson.M{"_id": id}
	update := bson.M{"$set": member}
	result, err := collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Failed to update member", http.StatusInternalServerError)
		return
	}

	// Check if the member was found and updated
	if result.MatchedCount == 0 {
		http.Error(w, "Member not found", http.StatusNotFound)
		return
	}

	// Return the updated member
	json.NewEncoder(w).Encode(member)
}
func handleLogin(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var data struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if member exists in database
	filter := bson.M{"email": data.Email}
	var member struct {
		ID       primitive.ObjectID `bson:"_id,omitempty"`
		Name     string             `bson:"name"`
		Email    string             `bson:"email"`
		Password string             `bson:"password"`
	}
	collection := client.Database("fitnesscenter").Collection("members_log")
	err = collection.FindOne(r.Context(), filter).Decode(&member)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "Invalid email or password", http.StatusBadRequest)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Compare password hashes
	err = bcrypt.CompareHashAndPassword([]byte(member.Password), []byte(data.Password))
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusBadRequest)
		return
	}

	// Return member ID and success
	response := struct {
		ID      primitive.ObjectID `json:"id"`
		Message string             `json:"message"`
	}{
		ID:      member.ID,
		Message: "Login successful",
	}
	json.NewEncoder(w).Encode(response)
}

func handleSignup(w http.ResponseWriter, r *http.Request) {
	// Parse request body
	var data struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if member already exists
	filter := bson.M{"email": data.Email}
	collection := client.Database("fitnesscenter").Collection("members_log")
	count, err := collection.CountDocuments(r.Context(), filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "Email address is already in use", http.StatusBadRequest)
		return
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Insert member into database
	member := bson.M{"name": data.Name, "email": data.Email, "password": string(hash)}
	result, err := collection.InsertOne(r.Context(), member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success
	response := struct {
		Success bool        `json:"success"`
		ID      interface{} `json:"id"`
	}{
		Success: true,
		ID:      result.InsertedID,
	}
	json.NewEncoder(w).Encode(response)
}

type Schedule struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name       string             `bson:"name,omitempty" json:"name,omitempty"`
	StartTime  string             `bson:"start_time,omitempty" json:"start_time,omitempty"`
	EndTime    string             `bson:"end_time,omitempty" json:"end_time,omitempty"`
	Instructor string             `bson:"instructor,omitempty" json:"instructor,omitempty"`
}

func createSchedule(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse the schedule data from the request body
	var schedule Schedule
	err := json.NewDecoder(r.Body).Decode(&schedule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Connect to the MongoDB database
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Get the "schedule" collection from the "fitnesscenter" database
	collection := client.Database("fitnesscenter").Collection("schedule")

	// Insert the new schedule into the database
	result, err := collection.InsertOne(context.Background(), schedule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the new schedule with the generated ID
	schedule.ID = result.InsertedID.(primitive.ObjectID)
	json.NewEncoder(w).Encode(schedule)
}

func getSchedule(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the ID of the schedule from the URL parameter
	params := mux.Vars(r)
	id := params["id"]

	// Connect to the MongoDB database
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Get the "schedule" collection from the "fitnesscenter" database
	collection := client.Database("fitnesscenter").Collection("schedule")

	// Find the schedule with the given ID in the database
	var schedule Schedule
	err = collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&schedule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Return the schedule
	json.NewEncoder(w).Encode(schedule)
}

func deleteSchedule(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the ID of the schedule from the URL parameter
	params := mux.Vars(r)
	id := params["id"]

	// Connect to the MongoDB database
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Get the "schedule" collection from the "fitnesscenter" database
	collection := client.Database("fitnesscenter").Collection("schedule")

	// Convert the ID string to a MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Delete the schedule with the given ID from the database
	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the number of deleted schedules
	json.NewEncoder(w).Encode(result.DeletedCount)
}

func updateSchedule(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the ID of the schedule from the URL parameter
	params := mux.Vars(r)
	id := params["id"]

	// Parse the updated schedule data from the request body
	var updatedSchedule Schedule
	err := json.NewDecoder(r.Body).Decode(&updatedSchedule)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Connect to the MongoDB database
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	// Get the "schedule" collection from the "fitnesscenter" database
	collection := client.Database("fitnesscenter").Collection("schedule")

	// Convert the ID string to a MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Update the schedule with the given ID in the database
	result, err := collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{
			"$set": bson.M{
				"name":       updatedSchedule.Name,
				"start_time": updatedSchedule.StartTime,
				"end_time":   updatedSchedule.EndTime,
				"instructor": updatedSchedule.Instructor,
			},
		},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return the number of updated schedules
	json.NewEncoder(w).Encode(result.ModifiedCount)
}

func handleFileUpload(w http.ResponseWriter, r *http.Request) {
	// Read file from request
	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file bytes
	fileBytes, err := ioutil.ReadAll(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Generate file ID
	fileID := uuid.New().String()

	// Save file to disk
	err = os.MkdirAll("uploads", os.ModePerm)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fileLocation := filepath.Join("uploads", fileID+filepath.Ext(handler.Filename))
	err = ioutil.WriteFile(fileLocation, fileBytes, os.ModePerm)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	collection := client.Database("fitnesscenter").Collection("files")
	_, err = collection.InsertOne(context.Background(), bson.M{
		"id":       fileID,
		"name":     handler.Filename,
		"location": fileLocation,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return file ID to client
	w.Write([]byte(fileID))
}
func handleFileDownload(w http.ResponseWriter, r *http.Request) {
	// Get file ID from URL
	vars := mux.Vars(r)
	fileID := vars["id"]

	// Find file metadata in MongoDB
	var result File
	collection := client.Database("fitnesscenter").Collection("files")
	err := collection.FindOne(context.Background(), bson.M{"id": fileID}).Decode(&result)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", result.Name))

	// Open file on disk and stream its contents to the response
	file, err := os.Open(result.Location)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()
	_, err = io.Copy(w, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


//criteria
