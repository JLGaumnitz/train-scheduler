var firebaseConfig = {
    apiKey: "AIzaSyC5VmhJwHC4al2OwVxsyYxQMPAPv71SjxU",
    authDomain: "train-scheduler-jlg.firebaseapp.com",
    databaseURL: "https://train-scheduler-jlg.firebaseio.com",
    projectId: "train-scheduler-jlg",
    storageBucket: "train-scheduler-jlg.appspot.com",
    messagingSenderId: "207176222467",
    appId: "1:207176222467:web:d157a3d3826da9b77fcb36"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

//   On click function to add trains to the top table
$("add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Variables with the user input from form
    var trainNumber = $("#formTrainNumber").val().trim();
    var trainDestination = $("#formDestination").val().trim();
    var firstTrainTime = $("#formFirstTime").val().trim();
    var trainFrequency = $("#formFrequency").val().trim();
    var trainPlatform = $("#formPlatform").val().trim();

    // Create temporary object to hold new train data

    var newTrain = {
        number: trainNumber,
        destination: trainDestination,
        firstTime: firstTrainTime,
        frequency: trainFrequency,
        platform: trainPlatform
    };

    // Upload new train data to database
    database.ref().push(newTrain);

    // Console log values pushed to database. DELETE THIS LATER.
    console.log(newTrain.number);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);
    console.log(newTrain.platform);

    // Clear the form values after the values are stored in database
    $("#formTrainNumber").val("");
    $("#formDestination").val("");
    $("#formFirstTime").val("");
    $("#formFrequency").val("")
    $("#formPlatform").val("")
});

// Create a firebase event for adding the data from the new trains and then updating the DOM.
database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store snapshot changes in variables
    var trainNumber = childSnapshot.val().number;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTime;
    var trainFrequency = childSnapshot.val().frequency;
    var trainPlatform = childSnapshot.val().platform;
  
    // Console log the values
    console.log(trainNumber);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);
    console.log(trainPlatform);

 // Process for calculating the Next Arrival and Minutes Away fields...

  // Make sure the first train time is after the eventual current time
  var firstTrainTimeConvert = moment(firstTrainTime, "hh:mm a").subtract(1, "years");

  // Store variable for current time
  var currentTime = moment().format("HH:mm a");
  console.log("Current Time:" + currentTime);

  // Store variable for difference of current time and first train time

  var trainTimeCurrentTimeDiff = moment().diff(moment(firstTrainTimeConvert), "minutes");
 
  // Store the time left
  var timeLeft = trainTimeCurrentTimeDiff % trainFrequency;

  // Calculate and store the minutes until next train arrives

  var minutesAway = trainFreqency - timeLeft;

  // Calculate the next arriving train
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  // Add the data into the DOM/html
  $("#train-table > tbody").append("<tr><td>" + trainNumber + "</td><td>" + trainDestination + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>" + trainPlatform + "</td></tr>");
}); 