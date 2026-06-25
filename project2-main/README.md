# Interactive Digital Clock & Timer

A simple, lightweight, and clean **Digital Clock & Timer** web application. This project was developed as a college assignment demonstrating fundamental frontend concepts using only pure HTML, CSS, and vanilla JavaScript.

## Folder Structure

```text
Clock-Timer/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Features

### 🕒 Digital Clock
* **Real-time Display:** Automatically updates every second using JavaScript `setInterval()`.
* **12-Hour format:** Shows current time in hours, minutes, and seconds, with an intuitive `AM/PM` marker.
* **Date indicator:** Displays the current weekday, month, day, and year underneath the digital time readout.

### ⏱️ Countdown Timer
* **Custom Configuration:** Simple input fields to configure desired minutes and seconds.
* **Control Actions:** Full buttons to Start, Pause, Resume, or Reset the countdown.
* **Timer Completion Alerts:**
  * Displays a prominent, flashing **"Time's Up!"** screen banner.
  * Plays a native browser beep sound using the **Web Audio API** (requires no external audio assets).
  * Triggers a standard system alert pop-up window.

### 🛠️ Input Validation
* **Typing Restrictions:** Restricts keys inside inputs to prevent letters (`e`, etc.), decimal points, positive signs, or negative signs from being entered.
* **Start-Up Checks:** Performs an alert warning when clicking "Start" without typing a valid count.

## Design Aesthetics
* Minimalist and readable high-contrast layout.
* Clean light gray cards centered on a light-neutral page.
* Accessible bright blue stateful buttons that indicate active/inactive states.
* Responsive design that shrinks and formats perfectly for mobile screens.

## Learning Objectives Demonstrated
1. **DOM Manipulation:** Accessing, modifying, disabling, and styling HTML elements dynamically.
2. **Event Listeners:** Listening to button clicks, keys typing, or pasting data.
3. **Timer Management:** Working with `setInterval()` and `clearInterval()` intervals.
4. **Validation Logic:** Parsing user values and catching empty/zero values gracefully.
5. **Basic Audio Synthesis:** Initiating an audio oscillator for standard browser sound generation.
