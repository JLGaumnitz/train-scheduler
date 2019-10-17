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
var trainNumber = "";
var trainDestination = "";
var firstTrainTime = "";
var trainFrequency = "";

//   On click function to add trains to the top table
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  
  // Variables with the user input from the bottom form
  trainNumber = $("#formTrainNumber").val().trim();
  trainDestination = $("#formDestination").val().trim();
  firstTrainTime = $("#formFirstTime").val().trim();
  trainFrequency = $("#formFrequency").val().trim();

  // Code for the push to Firebase
  dataRef.ref().push({
    number: trainNumber,
    destination: trainDestination,
    firstTime: firstTrainTime,
    frequency: trainFrequency,
  });
});

// Calculation of the Next Arrival and Minutes to Arrival fields

// Ensure the first train time is after the current time.
var convertedFirstTrainTime = moment(firstTrainTime, "HH:mm").subtract(1, "years");

// Store variable for current time.
var currentTime = moment().format("HH:mm");
console.log("Current time is:" + currentTime);

// Calculate difference between current time and first train time.
var elapsedTimefromFirstTrain = moment().diff(moment(convertedFirstTrainTime), "minutes");

// Calculate the time left (modulus of elapsed time divided by train frequency).
var timeLeft = elapsedTimefromFirstTrain % trainFrequency;

// Calculate and store the minutes until next train arrives.
var minutesAway = trainFrequency - timeLeft;

// Calculate the next arriving train
var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

// Firebase watcher + initial loader (This code behaves similarly to .on("value"))
dataRef.ref().on("child_added", function(childSnapshot) {

  // Log everything that is coming out of childSnapshot
  console.log(childSnapshot.val().number);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTime);
  console.log(childSnapshot.val().frequency);
  
  // Add the data into the table in HTML
  $("#trainScheduleBody").append("<tr><td>" + childSnapshot.val().number + "</td><td>" + childSnapshot.val().destination + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
},
  function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  // Clear the bottom form's values
  $("#formTrainNumber").val("");
  $("#formDestination").val("");
  $("#formFirstTime").val("");
  $("#formFrequency").val("");
