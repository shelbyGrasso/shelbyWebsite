"use strict";
window.onload = function(){

/* PAGE SETUP */
    // Declare variables
    var roomDate, roomTime, roomName, userName, userEmail, userPassword, cellID;
    var today, reservationDate;
    // Create array to hold reservation objects
    var allReservations = [];

    // Set max reservation date 30 days in future
    setMaxDate(30);
    // On page load, set default reservation page to today
    today = new Date().toLocaleDateString('en-CA', {timeZone: "America/New_York"});
    reservationDate = today;
    $("#date-select").val(reservationDate);
    $("#selected-date").text(reservationDate);
    changeReservationPage();

/* EVENT HANDLERS */
    // Display user's selected reservation page
    $("#date-select").change(function(){
        // Get selected date from date input field
        reservationDate = $("#date-select").val();
        // Set selected date cell in timetable
        $("#selected-date").text(reservationDate);
        // Load requested reservation page
        changeReservationPage();
        if (reservationDate < today) { // If a past date selected, reservations are view-only
            noClick();
        } else {
            clickOn();
        }
    })
    
    // Execute event when timeslots are clicked
    var clicked; // Declare variable to store last clicked timeslot
    var slots = $("td"); // All time cells, whether open or booked

    slots.click(function(evt){
        clicked = $(evt.target);
        // Timeslots not clickable until form is submitted or canceled
        noClick();
        // Get room name and assign to variable
        if (clicked.siblings().is($("#red-room"))) {
            roomName = "Red Room";
        } else if (clicked.siblings().is($("#orange-room"))) {
            roomName = "Orange Room";
        } else if (clicked.siblings().is($("#yellow-room"))) {
            roomName = "Yellow Room";
        } else if (clicked.siblings().is($("#green-room"))) {
            roomName = "Green Room";
        } else if (clicked.siblings().is($("#blue-room"))) {
            roomName = "Blue Room";
        } else if (clicked.siblings().is($("#purple-room"))) {
            roomName = "Purple Room";
        }
        // Get time and assign to variable
        roomTime = clicked.attr("name");
    
        if (clicked.hasClass("timeslot")){ // If open room is selected
            // Highlight selected time slot
            clicked.attr("class", "clicked");
            // Show reservation form
            $("#reserveForm").toggle();
            // Present confirmation of room and time
            document.getElementById("reserve-block").innerText = "Reserve the " + roomName + " at " + roomTime + "?";
        } else { // Event if booked room is selected
            // Highlight selected time slot
            clicked.attr("class", "delete");
            // Show deletion form
            $("#deleteForm").toggle();
        }
    }); //end slots.click

    // Event if user exits out of reservation form
    $("#cancel-btn").click(function(evt){
        // Hide form
        $("#reserveForm").toggle();
        // Change class back to unreserved/default
        clicked.attr("class", "timeslot");
        // Clear form input fields
        $("input").val("");
        // Clear email hint
        $(".tryagain").css("display", "none");
        // Make timeslots clickable
        clickOn();

    }); // end cancel reservation

    // Event if user completes reservation form
    $("#reserve-btn").click(function(evt){
        // validate email with one @ symbol and one . between characters
        var regex = /^[^\s@]+@[^\s@\.]+\.[^\s@.]+$/
        if (!(regex.test($("#email").val()))) {
            evt.preventDefault();  // If not valid, do not submit
            $(".tryagain").css("display", "block"); // Display hint to user
        } else {
            $(".tryagain").css("display", "none"); // Hide hint
        // Save reservation
            // Set variables for object properties
            roomDate = reservationDate; 
            userName = document.getElementById("username").value;
            userEmail = document.getElementById("email").value;
            userPassword = document.getElementById("pwd").value;
            cellID = clicked.attr("id");
            // Create new resrvation object
            var booking = new reservationEntry(roomDate, roomTime, roomName, userName, userEmail, userPassword, cellID);
            // Store in reservation array
            allReservations.push(booking);
            // Create JSON object and store updated reservation array to local storage
            window.localStorage.setItem("allReservations", JSON.stringify(allReservations));
            // Hide form
            $("#reserveForm").toggle();
            // Change class of reserved slot to booked and display user name
            clicked.attr("class", "booked");
            clicked.html("Reserved:" + "</br>" + document.getElementById("username").value);
            // Clear form input fields
            $("input").val("");
            // Make timeslots selectable
            clickOn();
        } //end else
    }); // end reservation submit
    
// Event if user exits deletion form
$("#goback-btn").click(function(evt){
    // Hide deletion form
    $("#deleteForm").toggle();
    // Change class back to booked
    clicked.attr("class", "booked");
    // Clear form input fields
    $("input").val("");
    // Remove password hint
    $(".tryagain").css("display", "none");
    // Make timeslots clickable
    clickOn();

});
// Event if user completes deletion form
$("#delete-btn").click(function(evt){
    // Find matching object
    var reservation;  // Variable to hold timeslot once found
    var reservationIndex;  // Variable to hold
    for (let i = 0; i < allReservations.length; i++ ){  // Loop through reservation array
        if (allReservations[i].room == roomName && allReservations[i].time == roomTime){  // Look for matching room name and time between reservatioin object and click event
            reservation = allReservations[i];  // Assign matching reservation to variable
            reservationIndex = i;  // Store matching index in variable
        }
    }
    // Get user's password attempt
    var pwdAttempt = document.getElementById("pwd-attempt");
    if (pwdAttempt.value == reservation.password) {  // if password attempt matches object password
        $(".tryagain").css("display", "none");  // hide password hint
        allReservations.splice(reservationIndex, 1);  // remove reservation from array
        // Store updated reservations
        window.localStorage.setItem("allReservations", JSON.stringify(allReservations));
        // Hide form
        $("#deleteForm").toggle();
        // Clear form input fields
        $("input").val("");
         // Change class of reserved slot to reservable/default
        clicked.attr("class", "timeslot");
        // Remove displayed reservation text from slot
        clicked.html("&nbsp;");
        // Make time slots selectable
        clickOn();
    } else {  // if wrong password, prompt user to try again
        $(".tryagain").css("display", "block");
    }
}); // end delete reservation


/* FUNCTIONS */

    // Generate maximum date for reservations
    function setMaxDate(numDays) {  // Parameter accepting max number of days for calendar
        var currentDay = new Date(); //  Assign current date to variable
        currentDay.setDate(currentDay.getDate() + numDays);
        var future = currentDay.toLocaleDateString('en-CA', {timeZone: "America/New_York"}); // Set to Canadian formatting (yyyy/mm/dd) for calendar max attribute
        $("#date-select").attr("max", future);
        return future;
    };

    // Make time slots non-clickable
    function noClick(){
        $(".timeslot").css("pointer-events", "none");
        $(".clicked").css("pointer-events", "none");
        $(".booked").css("pointer-events", "none");
        $(".delete").css("pointer-events", "none");
    };

    // Make time slots clickable
    function clickOn(){
        $(".timeslot").css("pointer-events", "auto");
        $(".clicked").css("pointer-events", "auto");
        $(".booked").css("pointer-events", "auto");
        $(".delete").css("pointer-events", "auto");
    };

    // Constructor function to store reservations
    function reservationEntry(d, t, r, n, e, p, c) {
        this.date = d;
        this.time = t;
        this.room = r
        this.name = n;
        this.email = e;
        this.password = p;
        this.cell = c
    }; // end reservationEntry

    // Clear table styles and set to default reservable slots
    function clearTable(){
        $(".booked").text("");
        $(".booked").attr("class", "timeslot");
    }; // end clearTable
   
    // Traverse the DOM to create unique id for each timetable slot
    function generateIds(el) {
        // At each node, determine if it's a table data cell
        if (el.nodeName == "TD") {
            // If so, get the class name of parent node, get the name of node, (get the selected date)
            var cellDate = reservationDate;
            var cellRoom = el.parentNode.id;
            var cellTime = $(el).attr("name"); //use jquery method
            // give element ID by concatenated date, room, and time
            el.id = cellDate + cellRoom + cellTime;
        }
        for (var i = 0; i < el.childNodes.length; i++) {
            generateIds(el.childNodes[i],);
        }
    };

    // Load entries from storage
    function loadReservations() {
        if (window.localStorage.getItem("allReservations") !== null) {
            var savedReservations = JSON.parse(localStorage.getItem("allReservations")); // Get JSON object, parse, and store in variable

            for (let i = 0; i < savedReservations.length; i++){ // Loop through array and create new objects
                var roomEntry = new reservationEntry(savedReservations[i].date, savedReservations[i].time, savedReservations[i].room, savedReservations[i].name, savedReservations[i].email, savedReservations[i].password, savedReservations[i].cell);
                allReservations.push(roomEntry);  // Add to array
                // Print it on table
                var timeslot = document.getElementById(savedReservations[i].cell); // Find time slot with mathcing ID and store in variable
                $(timeslot).attr("class", "booked"); // Change time slot to booked
                $(timeslot).html("Reserved:" + "</br>" + savedReservations[i].name);  // Display reservation in slot
            }
        }
    }; // end loadReservations

    // Refresh table with relevant timeslots
    function changeReservationPage() {
        clearTable();
        generateIds(document.documentElement);
        loadReservations();
    }; // changeReservationPage

}; // end Onload