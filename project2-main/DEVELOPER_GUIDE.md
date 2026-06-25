# Developer Guide

Detailed guide for developers who want to understand and extend this project.

---

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [Codebase Overview](#codebase-overview)
3. [Key JavaScript Functions](#key-javascript-functions)
4. [Adding Features](#adding-features)
5. [Debugging Tips](#debugging-tips)
6. [Best Practices](#best-practices)
7. [Performance Considerations](#performance-considerations)

---

## Project Architecture

```
User Interface (index.html)
         ↓
    Event Listeners
         ↓
JavaScript Functions (script.js)
         ↓
DOM Manipulation (style.css)
         ↓
Display Updates
```

### Data Flow

```
User Input (Minutes/Seconds)
    ↓
Validation Check
    ↓
Convert to Total Seconds
    ↓
Start Countdown Loop
    ↓
Update Display Every 1 Second
    ↓
Check if Countdown Complete
    ↓
Trigger Alerts
    ↓
Reset UI State
```

---

## Codebase Overview

### File Responsibilities

| File | Size | Purpose |
|------|------|---------|
| `index.html` | ~80 lines | Structure & semantic markup |
| `script.js` | ~350 lines | All JavaScript logic |
| `style.css` | ~200 lines | Styling & layout |
| `vite.config.ts` | ~10 lines | Build configuration |
| `tsconfig.json` | ~15 lines | TypeScript settings |

### Code Organization in script.js

```javascript
// Section 1: Global Variables (Lines 1-25)
let timerInterval = null;
let totalSeconds = 0;
let isPaused = false;

// Section 2: DOM Elements (Lines 27-50)
const clockDisplay = document.getElementById('clock-display');
const timerDisplay = document.getElementById('timer-display');
// ... more elements

// Section 3: Digital Clock Logic (Lines 52-95)
function pad(num) { ... }
function updateClock() { ... }

// Section 4: Timer Logic (Lines 97-200)
function formatTime(secs) { ... }
function countdown() { ... }
function startTimer() { ... }
// ... more timer functions

// Section 5: Event Listeners (Lines 202-250)
btnStart.addEventListener('click', startTimer);
// ... more listeners

// Section 6: Audio Synthesis (Lines 252-270)
function playBeep() { ... }
```

---

## Key JavaScript Functions

### Clock Functions

#### `pad(num)`
Adds leading zeros to single-digit numbers.
```javascript
function pad(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}

// Usage
pad(5);      // Returns "05"
pad(12);     // Returns "12"
pad(0);      // Returns "00"
```

#### `updateClock()`
Updates time and date displays every second.
```javascript
function updateClock() {
    const now = new Date();
    
    // Extract time components
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Convert to 12-hour format
    let ampm = "AM";
    if (hours >= 12) {
        ampm = "PM";
    }
    if (hours > 12) {
        hours = hours - 12;
    } else if (hours === 0) {
        hours = 12;
    }
    
    // Update display
    const timeString = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + " " + ampm;
    clockDisplay.textContent = timeString;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    dateDisplay.textContent = dateString;
}

// Called on page load and every 1 second
updateClock();
setInterval(updateClock, 1000);
```

### Timer Functions

#### `formatTime(secs)`
Converts seconds to MM:SS display format.
```javascript
function formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return pad(mins) + ":" + pad(remainingSecs);
}

// Usage
formatTime(125);   // Returns "02:05" (2 mins 5 secs)
formatTime(59);    // Returns "00:59"
formatTime(0);     // Returns "00:00"
```

#### `countdown()`
Core countdown function called every second.
```javascript
function countdown() {
    if (totalSeconds > 0) {
        totalSeconds--;
        timerDisplay.textContent = formatTime(totalSeconds);
    } else if (totalSeconds === 0 && timerInterval !== null) {
        // Timer completed - trigger alerts
        clearInterval(timerInterval);
        timerInterval = null;
        
        timerMessage.textContent = "Time's Up!";
        timerMessage.style.display = "block";
        
        playBeep();
        alert("Timer completed!");
        
        updateButtons();
    }
}
```

#### `startTimer()`
Initializes and starts the countdown.
```javascript
function startTimer() {
    // Get input values
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalSeconds = minutes * 60 + seconds;
    
    // Validate input
    if (totalSeconds <= 0) {
        alert("Please enter a valid time!");
        return;
    }
    
    // Clear any existing timer
    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }
    
    // Start countdown
    timerInterval = setInterval(countdown, 1000);
    isPaused = false;
    updateButtons();
    timerMessage.textContent = "";
}
```

#### `pauseTimer()`
Pauses the active countdown.
```javascript
function pauseTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
        isPaused = true;
        updateButtons();
    }
}
```

#### `resumeTimer()`
Resumes a paused countdown.
```javascript
function resumeTimer() {
    if (isPaused && totalSeconds > 0) {
        timerInterval = setInterval(countdown, 1000);
        isPaused = false;
        updateButtons();
    }
}
```

#### `resetTimer()`
Resets timer back to 00:00.
```javascript
function resetTimer() {
    // Stop countdown
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Clear display and inputs
    totalSeconds = 0;
    timerDisplay.textContent = "00:00";
    minutesInput.value = "";
    secondsInput.value = "";
    timerMessage.textContent = "";
    isPaused = false;
    
    // Reset buttons
    updateButtons();
}
```

#### `updateButtons()`
Enables/disables buttons based on current state.
```javascript
function updateButtons() {
    // Button logic:
    // - Start: enabled when no timer running
    // - Pause: enabled when timer running (not paused)
    // - Resume: enabled when timer paused
    // - Reset: enabled when timer exists
    
    btnStart.disabled = (timerInterval !== null);
    btnPause.disabled = (timerInterval === null || isPaused);
    btnResume.disabled = !isPaused;
    btnReset.disabled = (totalSeconds === 0 && timerInterval === null);
}
```

#### `playBeep()`
Generates sound using Web Audio API.
```javascript
function playBeep() {
    try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for tone generation
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        // Configure tone
        oscillator.frequency.value = 1000;  // Hz
        oscillator.type = 'sine';
        
        // Configure volume
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Connect and play
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error("Audio playback failed:", e);
    }
}
```

---

## Adding Features

### Feature 1: Preset Buttons (25 min focus, 5 min break)

**HTML Addition:**
```html
<div class="preset-buttons">
  <button class="preset-btn" data-seconds="1500">Focus (25m)</button>
  <button class="preset-btn" data-seconds="300">Break (5m)</button>
  <button class="preset-btn" data-seconds="60">Quick (1m)</button>
</div>
```

**JavaScript Addition:**
```javascript
// Add preset button handler
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const seconds = parseInt(e.target.dataset.seconds);
        totalSeconds = seconds;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        
        minutesInput.value = mins;
        secondsInput.value = secs;
        timerDisplay.textContent = formatTime(totalSeconds);
    });
});
```

### Feature 2: Dark Mode Toggle

**CSS Addition:**
```css
body.dark-mode {
    background-color: #1a1a1a;
    color: #e0e0e0;
}

.card.dark-mode {
    background-color: #2d2d2d;
    color: #e0e0e0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.btn.dark-mode {
    background-color: #404040;
    color: #e0e0e0;
}
```

**JavaScript Addition:**
```javascript
const darkModeBtn = document.getElementById('dark-mode-toggle');
darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Save preference to localStorage
    localStorage.setItem('darkMode', 
        document.body.classList.contains('dark-mode'));
});

// Load saved preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
```

### Feature 3: Sound Selection

**HTML Addition:**
```html
<select id="sound-select">
    <option value="sine">Sine Wave</option>
    <option value="square">Square Wave</option>
    <option value="sawtooth">Sawtooth Wave</option>
</select>
```

**JavaScript Modification:**
```javascript
function playBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        // Get selected wave type
        const waveType = document.getElementById('sound-select').value;
        oscillator.type = waveType;
        
        oscillator.frequency.value = 1000;
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.error("Audio playback failed:", e);
    }
}
```

---

## Debugging Tips

### 1. Browser DevTools (F12)

**Console Tab:**
```javascript
// Check global variables
console.log('timerInterval:', timerInterval);
console.log('totalSeconds:', totalSeconds);
console.log('isPaused:', isPaused);

// Test functions
updateClock();
formatTime(125);
```

**Elements Tab:**
- Inspect button states
- Check if elements are hidden/disabled
- Verify CSS is applied

### 2. Add Debug Logging

```javascript
function startTimer() {
    console.log('✓ Starting timer...');
    console.log('Minutes input:', minutesInput.value);
    console.log('Seconds input:', secondsInput.value);
    
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalSeconds = minutes * 60 + seconds;
    
    console.log('Total seconds:', totalSeconds);
    // ... rest of function
}
```

### 3. Breakpoints

1. Open DevTools (F12)
2. Go to Sources tab
3. Click line number in script.js
4. Refresh page - code pauses at breakpoint
5. Step through code and inspect variables

---

## Best Practices

### 1. Cache DOM Elements
```javascript
// ✅ GOOD: Cache at startup
const timerDisplay = document.getElementById('timer-display');

// Later, reuse the reference
timerDisplay.textContent = formatTime(totalSeconds);  // No querySelector

// ❌ BAD: Query every time
document.getElementById('timer-display').textContent = formatTime(totalSeconds);
```

### 2. Use Event Delegation
```javascript
// ✅ GOOD: Single event listener
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

// ❌ BAD: Multiple listeners (less efficient)
btn1.addEventListener('click', handler1);
btn2.addEventListener('click', handler2);
btn3.addEventListener('click', handler3);
```

### 3. Clear Intervals Properly
```javascript
// ✅ GOOD
if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
}

// ❌ BAD: May cause memory leaks
clearInterval(timerInterval);  // What if it's null?
```

### 4. Validate User Input
```javascript
// ✅ GOOD
function startTimer() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalSeconds = minutes * 60 + seconds;
    
    if (totalSeconds <= 0) {
        alert("Please enter a valid time!");
        return;
    }
    // Continue...
}

// ❌ BAD: No validation
function startTimer() {
    const totalSeconds = parseInt(minutesInput.value) * 60 + 
                        parseInt(secondsInput.value);
    // totalSeconds could be NaN!
}
```

---

## Performance Considerations

### Current Performance Profile

| Aspect | Status | Notes |
|--------|--------|-------|
| Clock Updates | ✅ Optimal | Single setInterval for all updates |
| Timer Updates | ✅ Optimal | Efficient countdown loop |
| DOM Queries | ✅ Optimal | Cached at startup |
| Memory | ✅ Good | Proper cleanup of intervals |
| Load Time | ✅ Fast | Lightweight codebase |

### Optimization Ideas

#### Use requestAnimationFrame for Clock
```javascript
// More efficient than setInterval for animations
function updateClockRAF() {
    updateClock();
    requestAnimationFrame(updateClockRAF);
}
updateClockRAF();
```

#### Debounce Input Handlers
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedInput = debounce(validateInput, 300);
minutesInput.addEventListener('input', debouncedInput);
```

#### Batch DOM Updates
```javascript
// ✅ GOOD: Update once
function updateDisplay() {
    const timeStr = formatTime(totalSeconds);
    const dateStr = getDateString();
    
    clockDisplay.textContent = timeStr;
    dateDisplay.textContent = dateStr;
}

// ❌ BAD: Multiple updates
clockDisplay.textContent = "HH:MM:SS";
clockDisplay.textContent = "HH:MM:SS AM/PM";  // Second update!
```

---

## Testing Checklist

- [ ] Clock updates every second
- [ ] Timer counts down correctly
- [ ] Pause/Resume work
- [ ] Reset clears everything
- [ ] Alerts trigger at 00:00
- [ ] Beep plays when timer completes
- [ ] Input validation prevents invalid entries
- [ ] Buttons enable/disable correctly
- [ ] Mobile layout responsive
- [ ] Works in all major browsers
- [ ] No console errors
- [ ] No memory leaks (check DevTools)

---

## Deployment Checklist

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - successful build
- [ ] Test production build: `npm run preview`
- [ ] Check network requests (DevTools)
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Update CHANGELOG
- [ ] Git commit and push
- [ ] Tag release version
- [ ] Deploy to hosting service

---

## Resources

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vite Documentation](https://vitejs.dev/)
- [CSS-Tricks](https://css-tricks.com/)

---

**Happy coding! 🚀**
