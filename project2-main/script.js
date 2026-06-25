/*
  script.js
  Interactive Digital Clock & Timer - Student Project
  Written by a first-year computer science student.
  
  This script manages a 12-hour AM/PM real-time clock and a countdown timer.
  It uses basic DOM manipulation, event listeners, and setInterval/clearInterval.
*/

// ==========================================
// 1. GLOBAL VARIABLES FOR TIMER STATE
// ==========================================
let timerInterval = null;  // Holds the interval ID for our countdown
let totalSeconds = 0;      // Stores remaining seconds for the timer
let isPaused = false;      // Keeps track of whether the timer is currently paused

// ==========================================
// 2. DOM ELEMENTS (Selecting items from HTML)
// ==========================================
// Clock elements
const clockDisplay = document.getElementById('clock-display');
const dateDisplay = document.getElementById('date-display');

// Timer display and inputs
const timerDisplay = document.getElementById('timer-display');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const timerMessage = document.getElementById('timer-message');

// Timer control buttons
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnReset = document.getElementById('btn-reset');


// ==========================================
// 3. DIGITAL CLOCK LOGIC
// ==========================================

// Helper function to add a leading zero to numbers less than 10
// Example: 5 becomes "05"
function pad(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}

// Function to update the clock every second
function updateClock() {
    const now = new Date();
    
    // Get hours, minutes, and seconds
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Determine AM or PM
    let ampm = "AM";
    if (hours >= 12) {
        ampm = "PM";
    }
    
    // Convert hours from 24-hour to 12-hour format
    if (hours > 12) {
        hours = hours - 12;
    } else if (hours === 0) {
        hours = 12; // Midnight is 12 AM
    }
    
    // Format the time string nicely (HH:MM:SS AM/PM)
    const timeString = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + " " + ampm;
    clockDisplay.textContent = timeString;
    
    // Format the date nicely (e.g. Thursday, June 25, 2026)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    dateDisplay.textContent = dateString;
}

// Start the clock immediately when the page loads, and then every 1 second
updateClock();
setInterval(updateClock, 1000);


// ==========================================
// 4. TIMER LOGIC
// ==========================================

// Helper function to convert seconds to MM:SS format
function formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return pad(mins) + ":" + pad(remainingSecs);
}

// This function runs every second during the countdown
function countdown() {
    if (totalSeconds > 0) {
        totalSeconds--;
        timerDisplay.textContent = formatTime(totalSeconds);
    }
    
    // When the timer hits 0, trigger completion
    if (totalSeconds === 0) {
        timerFinished();
    }
}

// Start the timer countdown
function startTimer() {
    // Read values from input fields and parse them as integers
    let minsValue = minutesInput.value;
    let secsValue = secondsInput.value;
    
    // Convert empty fields to 0
    let mins = minsValue === "" ? 0 : parseInt(minsValue, 10);
    let secs = secsValue === "" ? 0 : parseInt(secsValue, 10);
    
    // VALIDATION 1: Check if the user entered negative numbers or invalid letters
    if (mins < 0 || secs < 0 || isNaN(mins) || isNaN(secs)) {
        alert("Please enter a valid, non-negative number of minutes and seconds.");
        return;
    }
    
    // VALIDATION 2: Check if the time is completely 0
    if (mins === 0 && secs === 0) {
        alert("Please enter a valid time (minutes or seconds must be greater than 0) to start the timer!");
        return;
    }
    
    // Standardize seconds if the user input is 60 or more (e.g., 90 seconds becomes 1 min 30 secs)
    totalSeconds = (mins * 60) + secs;
    isPaused = false;
    
    // Update the timer numbers display
    timerDisplay.textContent = formatTime(totalSeconds);
    
    // Clear any previous countdowns just in case
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start interval to run the countdown() function every 1 second (1000 milliseconds)
    timerInterval = setInterval(countdown, 1000);
    
    // Update UI Elements and Button States
    timerMessage.textContent = ""; // Clear any old messages
    timerMessage.classList.remove('flash-message');
    
    minutesInput.disabled = true; // Block typing while timer is running
    secondsInput.disabled = true;
    
    btnStart.disabled = true;
    btnPause.disabled = false;
    btnResume.disabled = true;
    btnReset.disabled = false;
}

// Pause the timer
function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval); // Stop the counting
        isPaused = true;
        
        // Update button states
        btnPause.disabled = true;
        btnResume.disabled = false;
    }
}

// Resume the paused timer
function resumeTimer() {
    if (isPaused) {
        isPaused = false;
        
        // Restart the interval countdown
        timerInterval = setInterval(countdown, 1000);
        
        // Update button states
        btnPause.disabled = false;
        btnResume.disabled = true;
    }
}

// Reset the timer back to its initial starting screen
function resetTimer() {
    // 1. Stop any active countdown loop
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // 2. Reset states
    totalSeconds = 0;
    isPaused = false;
    
    // 3. Reset input fields
    minutesInput.value = "";
    secondsInput.value = "";
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    
    // 4. Reset screen displays
    timerDisplay.textContent = "00:00";
    timerMessage.textContent = "";
    timerMessage.classList.remove('flash-message');
    
    // 5. Reset button states
    btnStart.disabled = false;
    btnPause.disabled = true;
    btnResume.disabled = true;
    btnReset.disabled = true;
}

// Play a standard browser beep alert sound using the native Web Audio API
function playBeepSound() {
    try {
        // Initialize standard audio context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        
        const audioCtx = new AudioContextClass();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Wire up the sound source
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        // Setup pitch (440Hz is a standard A note) and sound wave shape
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        
        // Set volume (0.5 means 50%)
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        
        // Play the beep for 1.2 seconds
        oscillator.start();
        
        setTimeout(function() {
            oscillator.stop();
            audioCtx.close();
        }, 1200);
    } catch (e) {
        console.log("Audio Context beep was blocked by browser or not supported: ", e);
    }
}

// Triggered when timer hits zero
function timerFinished() {
    // Clear the countdown loop
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Display completion message with a flashing CSS effect
    timerMessage.textContent = "Time's Up!";
    timerMessage.classList.add('flash-message');
    
    // Play the alert audio beep
    playBeepSound();
    
    // Reset button states so the user can start again or reset
    btnPause.disabled = true;
    btnResume.disabled = true;
    btnStart.disabled = false;
    btnReset.disabled = false;
    
    // Standard popup alert to notify user
    setTimeout(function() {
        alert("Time's Up!");
    }, 100);
}


// ==========================================
// 5. EVENT LISTENERS AND SECURITY
// ==========================================

// Add click events to all control buttons
btnStart.addEventListener('click', startTimer);
btnPause.addEventListener('click', pauseTimer);
btnResume.addEventListener('click', resumeTimer);
btnReset.addEventListener('click', resetTimer);

// Input restriction: Prevent negative numbers or letters from being typed
const inputs = [minutesInput, secondsInput];
inputs.forEach(function(input) {
    // Prevent invalid keys from being pressed (e.g. negative '-', decimals '.', '+' and letter 'e')
    input.addEventListener('keydown', function(event) {
        const invalidKeys = ['-', '+', 'e', 'E', '.'];
        if (invalidKeys.includes(event.key)) {
            event.preventDefault();
        }
    });
    
    // Additional security check on paste or direct text changes
    input.addEventListener('input', function() {
        // If they bypass keys, force non-negative value
        if (input.value < 0) {
            input.value = 0;
        }
        // Ensure no letters remain (removes anything not numeric)
        input.value = input.value.replace(/[^0-9]/g, '');
    });
});
