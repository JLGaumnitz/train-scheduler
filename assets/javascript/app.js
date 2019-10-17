var firebaseConfig = {
  apiKey: "AIzaSyDhA3rTF7xo-dFMOdjblxqeGfvjNjwF7BY",
  authDomain: "jlg-project-1.firebaseapp.com",
  databaseURL: "https://jlg-project-1.firebaseio.com",
  projectId: "jlg-project-1",
  storageBucket: "jlg-project-1.appspot.com",
  messagingSenderId: "929921824755",
  appId: "1:929921824755:web:db113d1d32dc64db090486"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Initial Values
var trainName = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = "";

//   On click function to add trains to the top table
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  
  // Variables with the user input from the bottom form
   trainName = $("#formTrainName").val().trim();
   trainDestination = $("#formDestination").val().trim();
   firstTrainTime = $("#formFirstTime").val().trim();
   trainFrequency = $("#formFrequency").val().trim();

  var newTrain = {
    name: trainName,
    destination: trainDestination,
    firstTime: firstTrainTime,
    frequency: trainFrequency,
  };

  // Code to push to Firebase
  database.ref().push(newTrain);
  
  // Clear the bottom form's values.
  $("#formTrainName").val("");
  $("#formDestination").val("");
  $("#formFirstTime").val("");
  $("#formFrequency").val("");

});

// Calculation of the Next Arrival and Minutes Away

// Ensure the first train time is after the current time.
var convertedFirstTrainTime = moment(firstTrainTime, "hh:mm").subtract(1, "years");
console.log(convertedFirstTrainTime);

// Store variable for current time.
var currentTime = moment().format("HH:mm a");
console.log(currentTime);

// Calculate difference between current time and first train time.
var elapsedTimeSinceFirstTrain = moment().diff(moment(convertedFirstTrainTime), "minutes");
console.log(elapsedTimeSinceFirstTrain);

// Calculate the time left (modulus of elapsed time divided by train frequency).
var timeLeft = elapsedTimeSinceFirstTrain % trainFrequency;
console.log(timeLeft);

// Calculate and store the minutes until next train arrives.
var minutesAway = trainFrequency - timeLeft;
console.log(minutesAway)

// Calculate the next arriving train.
var nextArrival = moment().add(minutesAway, "minutes").format("h:mm a");
console.log(nextArrival)

// Firebase watcher + initial loader (Per lesson: This code behaves similarly to .on("value"))
database.ref().on("child_added", function(childSnapshot) {

  // Log items coming out of childSnapshot.
  console.log("Train name:" + childSnapshot.val().name);
  console.log("Train destination:" + childSnapshot.val().destination);
  console.log("Train first arrival:" + childSnapshot.val().firstTime);
  console.log("Train frequency:" + childSnapshot.val().frequency);
  
  // Add the data to the table in HTML.
  $("#trainScheduleBody").append("<tr><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().destination + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
},
  function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  })
