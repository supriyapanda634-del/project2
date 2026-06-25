# Quick Start Guide

Get the **Interactive Digital Clock & Timer** up and running in 2 minutes! ⚡

## TL;DR - Super Quick Start

```bash
# 1. Navigate to project
cd project2-main

# 2. Install & run
npm install
npm run dev

# 3. Open browser
# Visit http://localhost:3000/
```

Done! ✅ The app is now running locally.

---

## Step-by-Step Setup (5 minutes)

### 1️⃣ Prerequisites
Make sure you have:
- **Node.js** installed ([Download](https://nodejs.org/)) - check with `node --version`
- **npm** installed - check with `npm --version`
- A modern web browser (Chrome, Firefox, Safari, Edge)

### 2️⃣ Get the Code
```bash
# Clone from GitHub
git clone https://github.com/supriyapanda634-del/project2.git
cd project2-main
```

### 3️⃣ Install Dependencies
```bash
npm install
```
Wait for installation to complete (1-2 minutes on first install).

### 4️⃣ Start Development Server
```bash
npm run dev
```

You'll see:
```
VITE v6.2.3 ready in XXX ms
➜ Local:   http://localhost:3000/
```

### 5️⃣ Open in Browser
Click the link or visit: **http://localhost:3000/**

---

## Using the App

### 🕒 Clock
- Shows current time automatically
- Updates every second
- No setup needed!

### ⏱️ Timer
1. Enter **minutes** and **seconds**
2. Click **Start**
3. Watch it count down
4. Get an alert when done!

### 🎮 Controls
- **Start** - Begin countdown
- **Pause** - Freeze timer
- **Resume** - Continue from pause
- **Reset** - Clear to 00:00

---

## Common Commands

| Command | What it does |
|---------|------------|
| `npm run dev` | Start development server (edit files → auto-refresh) |
| `npm run build` | Create production-ready files in `dist/` folder |
| `npm run preview` | Test the production build locally |
| `npm run lint` | Check code for errors |

---

## Troubleshooting

### "Port 3000 is already in use"
```bash
npm run dev -- --port 3001
```

### "npm command not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal/PowerShell

### "Nothing shows up"
- Wait a few seconds for Vite to compile
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console for errors (F12)

---

## Want More?

- **Full Documentation:** Read [DOCUMENTATION.md](DOCUMENTATION.md)
- **Code Details:** See inline comments in [script.js](script.js)
- **Styling:** Check [style.css](style.css) for design patterns
- **HTML Structure:** View [index.html](index.html)

---

## Next Steps

✨ Explore the project:
- Try the timer with different durations
- Open browser DevTools (F12) to see the code
- Modify colors in `style.css`
- Add new features to `script.js`

Happy coding! 🚀
