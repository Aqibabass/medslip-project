# 🚀 MedSlip ATM System — Complete Setup Guide for Beginners

> **👋 Welcome!** You've just cloned the MedSlip ATM System project. This guide will walk you through **everything** — from what this project does, how all the parts work together, and exactly how to get it running on your computer step-by-step.

---

## 📌 Table of Contents

1. [What is This Project?](#-what-is-this-project)
2. [System Overview — How All Parts Fit Together](#-system-overview--how-all-parts-fit-together)
3. [Project Structure Explained (Which Folder Does What)](#-project-structure-explained-which-folder-does-what)
4. [Prerequisites — What You Need to Install First](#-prerequisites--what-you-need-to-install-first)
5. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
6. [Running the Complete System (All 3 Parts)](#-running-the-complete-system-all-3-parts)
7. [Testing the System End-to-End](#-testing-the-system-end-to-end)
8. [What Does Each Part Do? (Deep Dive)](#-what-does-each-part-do-deep-dive)
9. [Environment Variables Explained](#-environment-variables-explained)
10. [Common Problems & Fixes](#-common-problems--fixes)
11. [Quick Reference Commands](#-quick-reference-commands)

---

## 🏥 What is This Project?

**MedSlip** is a hospital queue management and prescription automation system. It replaces the traditional manual process of:

- ❌ Standing in long queues at hospital reception
- ❌ Manually distributing paper tokens
- ❌ Hand-writing prescription slips
- ❌ Losing or misplacing paper tokens
- ❌ Confusion about who's next in queue

**Instead, MedSlip provides:**
- ✅ **Patient Mobile App** — Patients fill their details on their phone, pick a department, and get a digital token
- ✅ **ATM-like Kiosk** — A touchscreen kiosk where patients enter their token and get a printed prescription slip
- ✅ **Backend Server** — The brain that manages patients, tokens, payments, and prevents fraud/duplicates

---

## 🧩 System Overview — How All Parts Fit Together

```
┌──────────────────────────────────────────────────────────────────┐
│                        HOW THE SYSTEM WORKS                       │
│                                                                   │
│  PATIENT (Phone/PC)           ATM KIOSK (Hospital)                │
│  ┌──────────────────┐        ┌──────────────────┐                │
│  │  1. Open App     │        │                  │                │
│  │  (localhost:5173)│        │  5. Enter Token  │                │
│  │                  │        │  (localhost:5174)│                │
│  │  2. Fill Details │        │                  │                │
│  │     (Name, Age,  │        │  6. Validate ✓   │                │
│  │      Phone, etc) │        │                  │                │
│  │                  │  ┌────►│  7. Show Slip    │                │
│  │  3. Pick Service │  │     │                  │                │
│  │     (Cardiology, │  │     │  8. Print Slip   │                │
│  │      Dentistry)  │  │     │                  │                │
│  │                  │  │     └────────┬─────────┘                │
│  │  4. Get Token ───┼──┘              │                          │
│  │     MS-ATM-XXXX  │           HTTP / JSON                      │
│  └────────┬─────────┘                │                          │
│           │                           │                          │
│           ▼                           ▼                          │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                    BACKEND SERVER                           │   │
│  │                    (localhost:5000)                         │   │
│  │                                                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ Patients │  │  Tokens  │  │ Payments │  │Printing  │  │   │
│  │  │  API     │  │  API     │  │  API     │  │Triggers  │  │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │   │
│  │       │              │             │              │        │   │
│  │       ▼              ▼             ▼              ▼        │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │                  MongoDB Database                      │  │   │
│  │  │  Collections: patients, tokens, payments               │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### The Flow in Simple Words:

1. **Patient** opens the app on their phone/computer → fills in name, age, phone, selects a department (like Cardiology or Dentistry)
2. **Backend** generates a unique token like `MS-ATM-A1B2C3D4`
3. If the service costs money (e.g., Cardiology = ₹500), the patient pays online via Razorpay (test mode)
4. **Patient** walks to the ATM Kiosk in the hospital and types their token on the touchscreen
5. **Backend** validates: Is this token real? Already used? Expired? Paid?
6. If valid → **Kiosk** shows a prescription preview and lets the patient print it
7. **Patient** takes the printed slip to the doctor

---

## 📂 Project Structure Explained (Which Folder Does What)

```
medslip-system/          ◄── THIS IS THE ROOT FOLDER (after cloning)
│
├── client/              ◄── 📱 PATIENT APP (React website for patients)
│   ├── src/pages/       │   Screens: PatientForm, ServiceSelection,
│   │                    │   Confirmation, TokenDisplay
│   └── src/services/    │   API calls to backend
│
├── kiosk/               ◄── 🖥️ ATM KIOSK (React website for the kiosk)
│   ├── src/pages/       │   Screens: ATM (token entry), PrintSlip
│   ├── src/components/  │   Keypad component
│   └── src/utils/       │   PDF slip generation (jsPDF)
│
├── server/              ◄── ⚙️ BACKEND API (Node.js + Express)
│   ├── models/          │   Database schemas (Patient, Token, Payment)
│   ├── routes/          │   API routes (patient, payment, atm endpoints)
│   ├── controllers/     │   Business logic for each route
│   ├── middleware/       │   Validation, auth
│   └── utils/           │   Token generator, Razorpay setup
│
├── SETUP_GUIDE.md       ◄── 📖 YOU ARE HERE — This guide
└── README.md            ◄── 📖 Full documentation (very detailed)
```

### 📱 Client (Patient App) — `client/`
This is the app patients use on their phone or computer. It has 4 screens in order:
1. **PatientForm** — Fill in name, age, gender, phone, etc.
2. **ServiceSelection** — Pick a medical department (Cardiology, Dentistry, etc.)
3. **Confirmation** — Review everything and confirm, pay if needed
4. **TokenDisplay** — Shows the generated token to take to the kiosk

### 🖥️ Kiosk (ATM Machine) — `kiosk/`
This is the touchscreen kiosk at the hospital. It has 2 main screens:
1. **ATM** — Shows an alphanumeric keypad where patients type their token
2. **PrintSlip** — Shows a preview of the prescription and a print button

### ⚙️ Server (Backend) — `server/`
This is the brain of the system. It handles:
- Creating patients and tokens in the database
- Processing payments via Razorpay
- Validating tokens when someone tries to print at the kiosk
- Making sure nobody can use the same token twice

---

## 📋 Prerequisites — What You Need to Install First

Before you can run this project, you need these things installed on your computer:

### 1️⃣ Node.js (required)
- **What it is:** JavaScript runtime that runs the backend server and the frontend apps
- **Download:** [https://nodejs.org/](https://nodejs.org/) (get **version 18 or higher**)
- **Check if already installed:** Open a command prompt and type:
  ```bash
  node --version
  ```
  You should see something like `v18.x.x` or higher

### 2️⃣ npm (comes with Node.js)
- **What it is:** Package manager that installs all the code libraries the project needs
- **Check if installed:**
  ```bash
  npm --version
  ```

### 3️⃣ MongoDB (required)
- **What it is:** The database where all patient info, tokens, and payments are stored
- **Two options:**

  **Option A: MongoDB Atlas (Cloud — EASIER ✅)**
  - Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
  - Sign up for a free account
  - Create a free cluster (takes 1-2 minutes)
  - Get your connection string (looks like: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/`)
  - You'll put this in the `.env` file later

  **Option B: MongoDB Community Server (Local — runs on your machine)**
  - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
  - Install and it will run in the background
  - Connection string: `mongodb://localhost:27017/medslip`

### 4️⃣ Git (optional but recommended)
- **What it is:** Used to clone the repository
- **Download:** [https://git-scm.com/](https://git-scm.com/)
- If you downloaded the ZIP instead, you don't need this

### 5️⃣ A Modern Browser
- Chrome, Firefox, or Edge

### 6️⃣ Code Editor (recommended)
- **VS Code** — [https://code.visualstudio.com/](https://code.visualstudio.com/)

---

## 🛠️ Step-by-Step Setup Guide

### Step 1: Clone or Download the Project

**Option A: Clone with Git (if you have Git installed)**
```bash
git clone https://github.com/Aqibabass/medslip-project.git
cd medslip-system
```

**Option B: Download ZIP**
- Go to the GitHub repository page
- Click the green "Code" button → "Download ZIP"
- Extract the ZIP to a folder like `C:\Users\YourName\Desktop\medslip-system`

---

### Step 2: Navigate Into the Project Folder

Open a **command prompt / terminal** and navigate to the project:
```bash
cd C:\Users\YourName\Desktop\medslip-system
```

---

### Step 3: Install Dependencies (The Libraries)

You need to install the dependencies for all 3 parts separately. Open **3 different terminal windows** (or do them one at a time):

#### Terminal/Command Prompt 1 — Install Backend (Server)
```bash
cd server
npm install
```
This will download all the backend libraries (Express, Mongoose, Razorpay, etc.) into `server/node_modules/`. Wait for it to finish — it may take 30-60 seconds.

#### Terminal/Command Prompt 2 — Install Patient App (Client)
```bash
cd client
npm install
```
This installs React, Vite, TailwindCSS, etc. for the patient app.

#### Terminal/Command Prompt 3 — Install ATM Kiosk
```bash
cd kiosk
npm install
```
This installs React, Vite, jsPDF, etc. for the kiosk.

> ✅ After these steps, each folder (`server/`, `client/`, `kiosk/`) will have a `node_modules/` folder with all the code it needs.

---

### Step 4: Configure Environment Variables

Environment variables are like configuration settings — they tell each part of the system how to connect to the others.

#### 📁 Backend Config — `server/.env`

Open the file `server/.env` in VS Code or Notepad. It should look like this:

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/?appName=Cluster0
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_here
HOSPITAL_NAME=MedSlip Hospital
JWT_SECRET=any_random_string_here
```

You **must** update these values:

| Variable | What it is | What to put |
|----------|-----------|-------------|
| `PORT` | Which port the server runs on | `5000` (keep as is) |
| `MONGO_URI` | Database connection string | Your MongoDB Atlas connection string OR `mongodb://localhost:27017/medslip` for local |
| `RAZORPAY_KEY_ID` | Your Razorpay test API key ID | Get from [dashboard.razorpay.com](https://dashboard.razorpay.com) → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Your Razorpay test API secret | Same place as above |
| `HOSPITAL_NAME` | Your hospital's name | Change to whatever you want |
| `JWT_SECRET` | Security key for tokens | Any random string (keep it secret) |

#### 📁 Patient App Config — `client/.env`

Open `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```
- `VITE_API_URL` → Keep as `http://localhost:5000/api` (points to your backend)
- `VITE_RAZORPAY_KEY_ID` → Put the **same Razorpay key ID** from above

#### 📁 Kiosk Config — `kiosk/.env`

Open `kiosk/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
- Keep as `http://localhost:5000/api` — points to your backend

> ⚠️ **NEVER** share or commit the `.env` files to GitHub with real API keys. The project already has them listed for testing.

---

## ▶️ Running the Complete System (All 3 Parts)

You need **3 separate terminal windows** running at the same time. Think of each as a separate "server" that needs to be turned on.

### Terminal 1: Start the Backend Server
```bash
cd medslip-system/server
npm start
```
**Expected output:**
```
MongoDB connected successfully
MedSlip server running on port 5000
```
> ✅ This means the database is connected and the API is ready. **Keep this terminal open.**

---

### Terminal 2: Start the Patient App (Frontend 1)
Open a **new** terminal window:
```bash
cd medslip-system/client
npm run dev
```
**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```
> ✅ The patient app is now live. **Keep this terminal open.**

---

### Terminal 3: Start the ATM Kiosk (Frontend 2)
Open another **new** terminal window:
```bash
cd medslip-system/kiosk
npm run dev
```
**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/
```
> ✅ The kiosk is now live. **Keep this terminal open.**

---

### 🎉 You're Running!

Now you have 3 things running simultaneously:
| Service | Address | What it does |
|---------|---------|-------------|
| Backend API | `http://localhost:5000` | Server + Database |
| Patient App | `http://localhost:5173` | Patient's phone interface |
| ATM Kiosk | `http://localhost:5174` | Hospital kiosk interface |

Open **`http://localhost:5173`** in your browser for the patient app.
Open **`http://localhost:5174`** in another browser tab for the kiosk.

---

## 🧪 Testing the System End-to-End

Here's a complete walkthrough to test the entire system:

### Part 1: Patient App (localhost:5173)

**Step 1 — Enter Patient Details**
- Fill in the form:
  - **Full Name:** Aaqib abass
  - **Age:** 27
  - **Gender:** Male
  - **Phone:** 9697838351
  - **Email:** rahul@example.com (optional)
  - **Doctor:** Dr. Asad(optional)
- Click **"Next: Select Service →"**

**Step 2 — Select a Service**
- Click on **"Cardiology"** (it has a fee of ₹500 — good for testing payment)
- Click **"Next: Confirm Details →"**

**Step 3 — Confirm & Generate Token**
- Review the information on screen
- Click **"Confirm & Generate Token"**
- You should see a **"Pay Now ₹500"** button appear

**Step 4 — Payment (Test Mode)**
- Click **"Pay Now ₹500"**
- The Razorpay payment popup opens
- Enter test card details:
  ```
  Card Number: 4100 2800 0000 1007
  Expiry: Any future date (e.g., 12/28)
  CVV: Any 3 digits (e.g., 123)
  ```
- Click **"Pay"**
- ✅ You should see **"✓ Token Generated Successfully!"**
- Your token will look like: **`MS-ATM-A1B2C3D4`**

**Step 5 — Copy Your Token**
- Click **"Copy Token"** button to copy it to clipboard
- Note: You'll need this for the kiosk

### Part 2: ATM Kiosk (localhost:5174)

**Step 6 — Enter Your Token**
- On the kiosk screen, you'll see an alphanumeric keypad
- Type your token: `MS-ATM-A1B2C3D4`
  - Use the letter keys (A-F), number keys (0-9), and the dash (-) key
  - Use "Clear" to fix mistakes
- Click **"Submit Token"**

**Step 7 — Validation**
- ✅ If valid: You'll see the prescription preview screen
- ❌ If error: You'll see an error message (already used, expired, etc.)

**Step 8 — Print the Slip**
- Click **"🖨️ Print Slip"**
- A PDF will open in a new tab with the print dialog
- You can print or save as PDF
- Close the PDF tab and return to the kiosk — it resets for the next patient

### Try These Tests Too:
1. **Re-enter the same token** → Should say "Token already used" (one-time print)
2. **Type a fake token** like `INVALID` → Should say "Token not found"
3. **Create a new patient with a free service** (General Medicine = Free) → No payment needed, token works directly

---

## 🔍 What Does Each Part Do? (Deep Dive)

### 📁 `server/` — The Backend (Brain of the System)

```
server/
├── server.js          ★ MAIN ENTRY POINT — Starts the server
├── .env               ★ Configuration (database, keys, etc.)
├── package.json       ★ List of libraries used
│
├── models/            ★ Database Structure (like a blueprint)
│   ├── Patient.js     → Schema: name, age, gender, phone, email, department, doctor
│   ├── Token.js       → Schema: tokenId, patientId, status, generatedAt, expiresAt
│   └── Payment.js     → Schema: razorpayOrderId, paymentId, amount, status
│
├── routes/            ★ API Endpoints (URLs the frontend calls)
│   ├── patientRoutes.js  → POST /api/patient/create  (create patient + token)
│   │                    → POST /api/patient/token-details (get token info)
│   ├── paymentRoutes.js  → POST /api/payment/order   (create Razorpay order)
│   │                    → POST /api/payment/verify   (verify payment)
│   └── atmRoutes.js      → POST /api/atm/validate    (check if token is valid)
│                        → POST /api/atm/print        (trigger print)
│
├── controllers/       ★ Business Logic (what happens when API is called)
│   ├── patientController.js  → Creates patient in DB, generates token
│   ├── paymentController.js  → Talks to Razorpay, verifies signatures
│   └── atmController.js      → Validates token status, marks as used
│
├── middleware/         ★ Security & Validation
│   ├── validation.js  → Joi validation (checks all inputs)
│   └── auth.js        → JWT authentication (optional)
│
└── utils/             ★ Helper Utilities
    ├── tokenGenerator.js  → Creates unique IDs like "MS-ATM-A1B2C3D4"
    └── razorpay.js        → Razorpay API client setup
```

**How the server works:**
1. `server.js` starts Express on port 5000
2. It connects to MongoDB using the `MONGO_URI` from `.env`
3. It sets up routes: `/api/patient/*`, `/api/payment/*`, `/api/atm/*`
4. When a request comes in:
   - Rate limiter checks: Is this IP making too many requests?
   - CORS checks: Is this request from localhost:5173 or 5174?
   - Middleware validates the data format
   - Controller processes the request (save to DB, call Razorpay, etc.)
   - Response sent back as JSON

---

### 📁 `client/` — The Patient App

```
client/
├── index.html         ★ HTML container (has <div id="root"></div>)
├── vite.config.js     ★ Build tool config (port 5173)
├── tailwind.config.js ★ CSS framework config (colors, fonts)
├── .env               ★ API URL + Razorpay key
├── package.json       ★ Dependencies list
│
└── src/
    ├── main.jsx       ★ React entry point (renders App into #root)
    ├── App.jsx        ★ Root component (sets up routing between pages)
    ├── index.css      ★ Global styles (TailwindCSS imports)
    │
    ├── pages/         ★ The 4 main screens
    │   ├── PatientForm.jsx      → Screen 1: Fill in personal details
    │   ├── ServiceSelection.jsx → Screen 2: Pick a medical department
    │   ├── Confirmation.jsx     → Screen 3: Review + Pay + Generate Token
    │   └── TokenDisplay.jsx     → Screen 4: Show the token number
    │
    ├── components/    ★ Reusable pieces
    │   ├── FormInput.jsx       → Input field with validation
    │   ├── ServiceCard.jsx     → One service in the grid
    │   ├── PaymentButton.jsx   → Razorpay payment trigger
    │   └── ProgressStepper.jsx → Shows ①→②→③→④ progress bar
    │
    └── services/
        └── api.js     ★ How the app talks to the backend (Axios)
```

**How the patient app works:**
1. `index.html` loads → React starts → `App.jsx` renders
2. `App.jsx` has React Router with 4 routes: `/`, `/service`, `/confirm`, `/token`
3. Each page stores data in the browser's `localStorage` as you go
4. When you click "Confirm", `api.js` sends a POST to the backend
5. The backend creates the patient + token, returns the token ID
6. If payment is needed, `PaymentButton.jsx` opens Razorpay modal
7. After payment (or if free), `TokenDisplay.jsx` shows the token

---

### 📁 `kiosk/` — The ATM Kiosk

```
kiosk/
├── index.html         ★ HTML container (for fullscreen kiosk)
├── vite.config.js     ★ Build tool config (port 5174)
├── tailwind.config.js ★ CSS config
├── .env               ★ API URL only
├── package.json       ★ Dependencies (includes jsPDF)
│
├── atm-ui/            ★ (optional) UI design assets
├── printer-service/   ★ (optional) Direct printer integration
│
└── src/
    ├── main.jsx       ★ React entry point
    ├── App.jsx        ★ Root component (manages screen states)
    ├── index.css      ★ Styles
    │
    ├── pages/
    │   ├── ATM.jsx          → Screen 1: Token entry with keypad
    │   └── PrintSlip.jsx    → Screen 2: Prescription preview + print
    │
    ├── components/
    │   └── Keypad.jsx       → Alphanumeric keypad (0-9, A-F, -, Clear)
    │
    ├── services/
    │   └── api.js     ★ Talks to backend (Axios)
    │
    └── utils/
        └── print.js   ★ Generates PDF using jsPDF
```

**How the kiosk works:**
1. Patient walks up to the kiosk and sees the keypad
2. They type their token (e.g., `MS-ATM-A1B2C3D4`)
3. App sends `POST /api/atm/validate` with the token
4. Backend checks all conditions (exists? paid? not expired? not used?)
5. If valid → Kiosk shows the prescription preview on screen
6. Patient clicks "Print Slip" → jsPDF generates an 80mm thermal-format PDF
7. Browser opens the PDF + print dialog
8. Patient prints and takes the slip to the doctor

---

## 🔐 Environment Variables Explained

Each part of the system has its own `.env` file. Here's what every variable does:

### `server/.env`
```env
PORT=5000                    # Which port the server runs on
MONGO_URI=mongodb://...      # Where the database lives
RAZORPAY_KEY_ID=rzp_test_xxx # Your Razorpay API key (test mode)
RAZORPAY_KEY_SECRET=xyz      # Your Razorpay secret (keep private!)
HOSPITAL_NAME=My Hospital    # Name shown on prescription slips
JWT_SECRET=random_string     # Used for JWT tokens (any random text)
```

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api    # Backend URL (VITE_ = exposed to browser)
VITE_RAZORPAY_KEY_ID=rzp_test_xxx         # Same key as server (needed by Razorpay checkout)
```

### `kiosk/.env`
```env
VITE_API_URL=http://localhost:5000/api    # Backend URL
```

> 💡 **Tip:** If you deploy to production, change `localhost` to your actual server URL. But for testing on your computer, leave as is.

---

## 🐛 Common Problems & Fixes

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| `npm install` fails | Network issue / Node version | Make sure Node.js ≥ 18, try `npm install --legacy-peer-deps` |
| `MongoDB connection error` | MongoDB isn't running | Start MongoDB service or check Atlas connection string in `.env` |
| `Port 5000 already in use` | Another program on port 5000 | Change `PORT=5001` in `server/.env` and update both `client/.env` and `kiosk/.env` |
| App shows blank page at localhost:5173 | Dev server not running | Did you run `npm run dev` in the `client/` folder? |
| Kiosk shows blank page at localhost:5174 | Dev server not running | Did you run `npm run dev` in the `kiosk/` folder? |
| "Cannot find module" errors | Missing `node_modules` | Run `npm install` in that specific folder |
| CORS error in browser console | Backend not running | Start the server with `npm start` in `server/` folder |
| "API is not reachable" | Wrong URL in `.env` | Check `VITE_API_URL` in `client/.env` and `kiosk/.env` |
| Razorpay popup doesn't open | Missing Razorpay key | Set `RAZORPAY_KEY_ID` in both `server/.env` and `client/.env` |
| "Invalid token" at kiosk | Typo or wrong format | Token format is `MS-ATM-XXXXXXXX` (all caps A-F + digits) |
| "Token already used" | Same token submitted twice | Generate a new token from the patient app |

---

## ⚡ Quick Reference Commands

Copy and paste these in order:

```bash
# 1. Install Backend Dependencies
cd server && npm install

# 2. Install Patient App Dependencies
cd ../client && npm install

# 3. Install Kiosk Dependencies
cd ../kiosk && npm install

# ——— Now open 3 terminals ———

# Terminal 1: Start Backend
cd server && npm start

# Terminal 2: Start Patient App
cd client && npm run dev

# Terminal 3: Start ATM Kiosk
cd kiosk && npm run dev
```

**After running everything:**
| Open in browser | What you see |
|----------------|-------------|
| `http://localhost:5173` | 🏥 Patient App — fill details, get token |
| `http://localhost:5174` | 🖥️ ATM Kiosk — enter token, print slip |
| `http://localhost:5000/api/health` | ✅ Backend health check |

---

## 💡 Need More Details?

For **detailed API documentation, database schemas, security features, UI screenshots, deployment guides, and troubleshooting**, check out the full documentation:

📖 **`README.md`** — The comprehensive 1,458-line reference file in the project root.

---

## 🎯 Summary

| Part | Port | What it does |
|------|------|-------------|
| **Backend (server/)** | `:5000` | API server + MongoDB database |
| **Patient App (client/)** | `:5173` | Patient's phone interface |
| **ATM Kiosk (kiosk/)** | `:5174` | Hospital kiosk for printing slips |

**The flow is simple:** Patient uses app → gets token → goes to kiosk → enters token → prints slip → sees doctor.

---

> Built with ❤️ for hospital queue management. Questions? Check the main `README.md` or open an issue on GitHub.