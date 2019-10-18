
// Initialize Firebase

var firebaseConfig = {
  apiKey: "AIzaSyDhA3rTF7xo-dFMOdjblxqeGfvjNjwF7BY",
  authDomain: "jlg-project-1.firebaseapp.com",
  databaseURL: "https://jlg-project-1.firebaseio.com",
  projectId: "jlg-project-1",
  storageBucket: "jlg-project-1.appspot.com",
  messagingSenderId: "929921824755",
  appId: "1:929921824755:web:db113d1d32dc64db090486"
};

firebase.initializeApp(firebaseConfig);

// Global Variables

var trainName;
var trainDestination;
var firstTrainTime;
var trainFrequency;

$(document).ready(function () {
  
  var database = firebase.database();

  // On click function to add trains to the top table

  $("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Variables with the user input from the bottom form
    var formTrainName = $("#formTrainName").val();
    var formDestination = $("#formDestination").val();
    var formFirstTrainTime = $("#formFirstTime").val();
    var formFrequency = $("#formFrequency").val();

    database.ref().push({
      trainName: formTrainName,
      destination: formDestination,
      firstTrainTime: formFirstTrainTime,
      frequency: formFrequency,
    })
  })

  // Firebase watcher + initial loader (Per in-class lesson: This code behaves similarly to .on("value"))

  database.ref().on("child_added", function (childSnapshot) {

    var newTrainName = childSnapshot.val().trainName;
    var newDestination = childSnapshot.val().destination;
    var newFirstTrainTime = childSnapshot.val().firstTrainTime;
    var newFrequency = childSnapshot.val().frequency;

    console.log("Train name: " + newTrainName)
    console.log("Destination: " + newDestination)
    console.log("First Arrival: " + newFirstTrainTime)
    console.log("Frequency: " + newFrequency)

    var currentTime = moment()
    var firstTimeConverted = moment(newFirstTrainTime, "hh:mm").subtract(1, "years")
    var timeDifference = moment().diff(moment(firstTimeConverted, "minutes"))
    var modulusRemainder = timeDifference % newFrequency
    var minutesAway = newFrequency - modulusRemainder
    var nextTrainArrival = moment().add(minutesAway, "minutes").format("hh:mm a")

    console.log(currentTime.format("hh:mm a"))
    console.log(firstTimeConverted)
    console.log(timeDifference)
    console.log(modulusRemainder)
    console.log(minutesAway)
    console.log(nextTrainArrival)

    var newRowItem = $("<tr><td>" + newTrainName + "</td><td>" + newDestination + "</td><td>" + nextTrainArrival + "</td><td>" + minutesAway + "</td><td>" + newFrequency + "</td></tr>");

    // Add the data to the table in HTML.
    $("#trainScheduleBody").append(newRowItem);
  },
    function (errorObject) {
      console.log("Errors handled: " + errorObject.code);   
    });

    // Clear the form's values.
    $("#formTrainName").empty();
    $("#formDestination").empty();
    $("#formFirstTime").empty();
    $("#formFrequency").empty();
    
});

