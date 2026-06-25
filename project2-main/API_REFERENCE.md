# API Reference

Complete API documentation for the Interactive Digital Clock & Timer project.

---

## Table of Contents
1. [Global Variables](#global-variables)
2. [Clock API](#clock-api)
3. [Timer API](#timer-api)
4. [UI Control Functions](#ui-control-functions)
5. [DOM Elements Reference](#dom-elements-reference)
6. [Event Listeners](#event-listeners)
7. [Utility Functions](#utility-functions)

---

## Global Variables

### `timerInterval`
**Type:** `number | null`  
**Default:** `null`  
**Description:** Stores the interval ID for the active countdown timer.

```javascript
let timerInterval = null;

// When timer is running
timerInterval = setInterval(countdown, 1000);

// When timer is paused/stopped
if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
}
```

### `totalSeconds`
**Type:** `number`  
**Default:** `0`  
**Description:** Total remaining seconds in the countdown timer.

```javascript
let totalSeconds = 0;

// Set when timer starts
totalSeconds = minutes * 60 + seconds;

// Decremented every second during countdown
totalSeconds--;
```

### `isPaused`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Tracks whether the countdown timer is currently paused.

```javascript
let isPaused = false;

// Set to true when user clicks pause
isPaused = true;

// Set to false when user clicks resume or start
isPaused = false;
```

---

## Clock API

### `pad(num)`
**Purpose:** Add leading zeros to single-digit numbers.

**Signature:**
```javascript
function pad(num: number): string
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `num` | number | Number to pad (0-59 for time display) |

**Returns:** String with leading zero if needed.

**Example:**
```javascript
pad(5);      // "05"
pad(12);     // "12"
pad(0);      // "00"
pad(120);    // "120"
```

### `updateClock()`
**Purpose:** Update digital clock and date displays with current time.

**Signature:**
```javascript
function updateClock(): void
```

**Parameters:** None

**Returns:** void (updates DOM directly)

**Side Effects:**
- Updates `#clock-display` with time (HH:MM:SS AM/PM)
- Updates `#date-display` with full date
- Called every 1 second via `setInterval()`

**Example:**
```javascript
// Called on page load
updateClock();

// Called every 1 second
setInterval(updateClock, 1000);
```

**Internal Logic:**
1. Creates new Date object
2. Extracts hours, minutes, seconds
3. Converts to 12-hour format with AM/PM
4. Formats date string (e.g., "Wednesday, June 25, 2026")
5. Updates DOM elements

---

## Timer API

### `formatTime(secs)`
**Purpose:** Convert seconds to MM:SS display format.

**Signature:**
```javascript
function formatTime(secs: number): string
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `secs` | number | Total seconds to format |

**Returns:** String in MM:SS format

**Example:**
```javascript
formatTime(125);    // "02:05"
formatTime(59);     // "00:59"
formatTime(0);      // "00:00"
formatTime(3661);   // "61:01" (1 hour 1 min 1 sec)
```

**Algorithm:**
```
minutes = floor(secs / 60)
remaining_seconds = secs % 60
return pad(minutes) + ":" + pad(remaining_seconds)
```

### `countdown()`
**Purpose:** Core countdown loop function called every second.

**Signature:**
```javascript
function countdown(): void
```

**Parameters:** None

**Returns:** void

**Behavior:**
1. Decrements `totalSeconds` by 1
2. Updates `#timer-display` with new time
3. When countdown reaches 0:
   - Stops the interval
   - Displays "Time's Up!" message
   - Plays beep sound
   - Shows alert dialog
   - Resets button states

**Example:**
```javascript
// Started via setInterval
timerInterval = setInterval(countdown, 1000);

// Stops automatically when totalSeconds reaches 0
```

### `startTimer()`
**Purpose:** Initialize and start the countdown timer.

**Signature:**
```javascript
function startTimer(): void
```

**Parameters:** None (reads from `#minutes-input` and `#seconds-input`)

**Returns:** void

**Input Validation:**
- Reads minutes from `minutesInput.value`
- Reads seconds from `secondsInput.value`
- Defaults to 0 if input is empty
- Shows alert if total is 0 or negative

**Side Effects:**
- Sets `totalSeconds = minutes * 60 + seconds`
- Starts `timerInterval` with `countdown()` function
- Sets `isPaused = false`
- Calls `updateButtons()` to enable/disable controls
- Clears any previous timer message

**Example:**
```javascript
// User enters 5 minutes and 30 seconds, clicks Start
minutesInput.value = "5";
secondsInput.value = "30";
startTimer();
// totalSeconds = 330 (5*60 + 30)
// Countdown begins: 330, 329, 328, ...
```

### `pauseTimer()`
**Purpose:** Pause the active countdown timer.

**Signature:**
```javascript
function pauseTimer(): void
```

**Parameters:** None

**Returns:** void

**Behavior:**
- Clears `timerInterval`
- Sets `timerInterval = null`
- Sets `isPaused = true`
- Calls `updateButtons()` to update UI
- `totalSeconds` remains unchanged

**Side Effects:**
- Timer display freezes at current value
- User can later call `resumeTimer()` to continue

**Example:**
```javascript
// Timer running at 02:30
pauseTimer();
// Timer display stays at 02:30
// Resume button becomes available
```

### `resumeTimer()`
**Purpose:** Resume a paused countdown timer.

**Signature:**
```javascript
function resumeTimer(): void
```

**Parameters:** None

**Returns:** void

**Preconditions:**
- `isPaused` must be `true`
- `totalSeconds` must be > 0

**Behavior:**
- Restarts `timerInterval` with `countdown()` function
- Sets `isPaused = false`
- Calls `updateButtons()` to update UI

**Example:**
```javascript
// Timer was paused at 02:30
resumeTimer();
// Timer resumes: 02:29, 02:28, 02:27, ...
```

### `resetTimer()`
**Purpose:** Reset timer to 00:00 and clear all state.

**Signature:**
```javascript
function resetTimer(): void
```

**Parameters:** None

**Returns:** void

**Behavior:**
1. Stops active countdown if running
2. Sets `totalSeconds = 0`
3. Updates timer display to "00:00"
4. Clears input fields
5. Clears "Time's Up!" message
6. Sets `isPaused = false`
7. Calls `updateButtons()` to reset button states

**Side Effects:**
- All timer state cleared
- UI returns to initial state
- User must enter new time to start again

**Example:**
```javascript
// Timer was running at 01:45
resetTimer();
// Display: 00:00
// Inputs: empty
// Buttons: Start enabled, others disabled
```

---

## UI Control Functions

### `updateButtons()`
**Purpose:** Enable/disable timer control buttons based on current state.

**Signature:**
```javascript
function updateButtons(): void
```

**Parameters:** None

**Returns:** void

**Button Logic:**
| Button | Enabled When | Disabled When |
|--------|--------------|---------------|
| Start | No timer running | Timer is active |
| Pause | Timer running (not paused) | No timer or already paused |
| Resume | Timer is paused | No timer or timer running |
| Reset | Any timer exists | Timer is 00:00 and stopped |

**Implementation:**
```javascript
btnStart.disabled = (timerInterval !== null);
btnPause.disabled = (timerInterval === null || isPaused);
btnResume.disabled = !isPaused;
btnReset.disabled = (totalSeconds === 0 && timerInterval === null);
```

**Example:**
```javascript
// Initial state
updateButtons();
// Start: enabled, Pause: disabled, Resume: disabled, Reset: disabled

// After clicking Start
updateButtons();
// Start: disabled, Pause: enabled, Resume: disabled, Reset: enabled

// After clicking Pause
updateButtons();
// Start: disabled, Pause: disabled, Resume: enabled, Reset: enabled
```

### `playBeep()`
**Purpose:** Generate audio beep using Web Audio API.

**Signature:**
```javascript
function playBeep(): void
```

**Parameters:** None

**Returns:** void

**Audio Configuration:**
- **Frequency:** 1000 Hz (sine wave)
- **Duration:** 0.5 seconds
- **Volume:** Decays from 0.3 to 0.01

**Browser Support:**
- ✅ Chrome, Firefox, Safari, Edge (latest versions)
- ❌ IE 11
- Gracefully fails with try/catch if Web Audio API unavailable

**Example:**
```javascript
// Called when timer reaches 00:00
playBeep();
// Generates 500ms beep sound

// Custom frequency
function playBeep(frequency = 1000) {
    // Modify oscillator.frequency.value = frequency
}
```

---

## DOM Elements Reference

### Input Elements

#### `#minutes-input`
**Type:** `<input type="number">`  
**Default:** Empty string  
**Attributes:**
- `min="0"`
- `placeholder="0"`

**Usage:**
```javascript
const minutesInput = document.getElementById('minutes-input');

// Read value
const minutes = parseInt(minutesInput.value) || 0;

// Set value
minutesInput.value = "5";

// Clear
minutesInput.value = "";
```

#### `#seconds-input`
**Type:** `<input type="number">`  
**Default:** Empty string  
**Attributes:**
- `min="0"`
- `max="59"`
- `placeholder="0"`

**Usage:**
```javascript
const secondsInput = document.getElementById('seconds-input');
const seconds = parseInt(secondsInput.value) || 0;
secondsInput.value = "30";
```

### Display Elements

#### `#clock-display`
**Type:** `<div class="clock-display">`  
**Content:** Time string (e.g., "03:45:23 PM")

#### `#date-display`
**Type:** `<div class="date-display">`  
**Content:** Date string (e.g., "Wednesday, June 25, 2026")

#### `#timer-display`
**Type:** `<div class="timer-display">`  
**Content:** Countdown (e.g., "02:30")

#### `#timer-message`
**Type:** `<div class="timer-message">`  
**Content:** "Time's Up!" message when countdown completes

### Button Elements

#### `#btn-start`
```javascript
const btnStart = document.getElementById('btn-start');
btnStart.addEventListener('click', startTimer);
```

#### `#btn-pause`
```javascript
const btnPause = document.getElementById('btn-pause');
btnPause.addEventListener('click', pauseTimer);
```

#### `#btn-resume`
```javascript
const btnResume = document.getElementById('btn-resume');
btnResume.addEventListener('click', resumeTimer);
```

#### `#btn-reset`
```javascript
const btnReset = document.getElementById('btn-reset');
btnReset.addEventListener('click', resetTimer);
```

---

## Event Listeners

### Button Click Events

```javascript
// Start button
btnStart.addEventListener('click', startTimer);

// Pause button
btnPause.addEventListener('click', pauseTimer);

// Resume button
btnResume.addEventListener('click', resumeTimer);

// Reset button
btnReset.addEventListener('click', resetTimer);
```

### Input Validation Events

```javascript
// Prevent invalid characters in minutes input
minutesInput.addEventListener('keydown', handleKeyInput);

// Prevent invalid characters in seconds input
secondsInput.addEventListener('keydown', handleKeyInput);
```

**Valid Characters:**
- Numbers (0-9)
- Backspace
- Delete
- Arrow keys
- Tab

**Invalid Characters Blocked:**
- Letters (a-z, e)
- Symbols (+, -, ., etc.)
- Decimal point

---

## Utility Functions

### `handleKeyInput(event)`
**Purpose:** Validate keyboard input for timer fields.

**Signature:**
```javascript
function handleKeyInput(event: KeyboardEvent): void
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `event` | KeyboardEvent | Keyboard event object |

**Behavior:**
- Allows: 0-9, Backspace, Delete, Arrows, Tab
- Prevents: a-z, +, -, ., e, etc.
- Prevents paste of invalid characters

**Example:**
```javascript
// Typing "5" → ✅ Accepted
// Typing "e" → ❌ Blocked
// Typing "+" → ❌ Blocked
```

---

## State Diagram

```
START
  ↓
Initial State
  ├─ timerInterval: null
  ├─ totalSeconds: 0
  ├─ isPaused: false
  └─ All buttons: Start only
  
  ↓ User clicks Start (enters time)
  
Running State
  ├─ timerInterval: [number]
  ├─ totalSeconds: [counting down]
  ├─ isPaused: false
  └─ Buttons: Start=disabled, Pause=enabled
  
  ├─ User clicks Pause
  │  ↓
  │  Paused State
  │  ├─ timerInterval: null
  │  ├─ totalSeconds: [frozen]
  │  ├─ isPaused: true
  │  └─ Buttons: Resume=enabled, Pause=disabled
  │  
  │  ├─ User clicks Resume → Back to Running
  │  └─ User clicks Reset → Back to Initial
  
  ├─ User clicks Reset → Back to Initial
  
  └─ totalSeconds reaches 0
     ↓
     Completion State
     ├─ Shows "Time's Up!"
     ├─ Plays beep
     ├─ Shows alert
     └─ Resets to Initial State
```

---

## Performance Metrics

| Operation | Time | Frequency |
|-----------|------|-----------|
| Clock update | < 1ms | 1x per second |
| Timer countdown | < 1ms | 1x per second |
| Button update | < 1ms | On state change |
| Audio beep | 500ms | On timer complete |

---

## Example Usage

### Complete Timer Workflow
```javascript
// 1. User enters 2 minutes 30 seconds
minutesInput.value = "2";
secondsInput.value = "30";

// 2. User clicks Start
startTimer();
// totalSeconds = 150

// 3. System counts down
// After 30 seconds...
// totalSeconds = 120
// #timer-display shows "02:00"

// 4. User clicks Pause
pauseTimer();
// timerInterval stops, isPaused = true

// 5. User clicks Resume
resumeTimer();
// Countdown continues

// 6. Countdown finishes
// countdown() at totalSeconds = 0
// Plays beep
// Shows "Time's Up!"
// Shows alert
```

---

## Error Handling

### No Error Handling Currently Implemented
- Input validation prevents invalid timer values
- Web Audio API wrapped in try/catch
- All other operations are synchronous and safe

### Future Improvements
```javascript
function startTimer() {
    try {
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;
        
        if (minutes < 0 || seconds < 0) {
            throw new Error("Time values must be positive");
        }
        
        if (minutes > 1440 || seconds > 59) {
            throw new Error("Time values out of range");
        }
        
        // Continue...
    } catch (error) {
        console.error("Timer error:", error);
        alert(error.message);
    }
}
```

---

**Last Updated:** June 25, 2026  
**API Version:** 1.0
