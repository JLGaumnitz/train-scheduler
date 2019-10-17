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

var dataRef = firebase.database();

// Initial Values
var trainName = "";
var trainDestination = "";
var firstTrainTime = "00:00";
var trainFrequency = "0";

//   On click function to add trains to the top table
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  
  // Variables with the user input from the bottom form
  trainName = $("#formTrainName").val().trim();
  trainDestination = $("#formDestination").val().trim();
  firstTrainTime = $("#formFirstTime").val().trim();
  trainFrequency = $("#formFrequency").val().trim();

  // Code to push to Firebase
  dataRef.ref().push({
    number: trainName,
    destination: trainDestination,
    firstTime: firstTrainTime,
    frequency: trainFrequency,
  });
});

// Calculation of the Next Arrival and Minutes Away

// Ensure the first train time is after the current time.
var convertedFirstTrainTime = moment(firstTrainTime, "hh:mm a").subtract(1, "years");

// Store variable for current time.
var currentTime = moment().format("HH:mm a");

// Calculate difference between current time and first train time.
var elapsedTimeSinceFirstTrain = moment().diff(moment(convertedFirstTrainTime), "minutes");

// Calculate the time left (modulus of elapsed time divided by train frequency).
var timeLeft = elapsedTimeSinceFirstTrain % trainFrequency;

// Calculate and store the minutes until next train arrives.
var minutesAway = trainFrequency - timeLeft;

// Calculate the next arriving train.
var nextArrival = moment().add(minutesAway, "minutes").format("h:mm a");


// Firebase watcher + initial loader (Per lesson: This code behaves similarly to .on("value"))
dataRef.ref().on("child_added", function(childSnapshot) {

  // Log items coming out of childSnapshot.
  console.log(childSnapshot.val().number);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTime);
  console.log(childSnapshot.val().frequency);
  
  // Add the data to the table in HTML.
  $("#trainScheduleBody").append("<tr><td>" + childSnapshot.val().number + "</td><td>" + childSnapshot.val().destination + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
},
  function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  // Clear the bottom form's values.
  $("#formTrainName").val("");
  $("#formDestination").val("");
  $("#formFirstTime").val("");
  $("#formFrequency").val("");
