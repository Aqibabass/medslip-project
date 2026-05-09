# 🏥 MedSlip ATM System

## Complete Hospital Token & Prescription Slip Management System

---

## 📋 Table of Contents
1. [What is MedSlip ATM System?](#what-is-medslip-atm-system)
2. [The Problem It Solves](#the-problem-it-solves)
3. [System Flow Overview](#system-flow-overview)
4. [Who Uses the System?](#who-uses-the-system)
5. [Detailed Step-by-Step Flow](#detailed-step-by-step-flow)
6. [Tech Stack](#tech-stack)
7. [Project Architecture](#project-architecture)
8. [Folder Structure](#folder-structure)
9. [Prerequisites](#prerequisites)
10. [Complete Setup Guide](#complete-setup-guide)
11. [Running the System](#running-the-system)
12. [End-to-End Testing Guide](#end-to-end-testing-guide)
13. [API Reference](#api-reference)
14. [Database Models](#database-models)
15. [Security Features](#security-features)
16. [Payment Integration](#payment-integration)
17. [Printing System](#printing-system)
18. [UI Screens Guide](#ui-screens-guide)
19. [Troubleshooting](#troubleshooting)
20. [Deployment Guide](#deployment-guide)

---

## What is MedSlip ATM System?

MedSlip is a **hospital queue management and prescription automation system**. It replaces the traditional manual process of:

- Standing in long queues at hospital reception
- Manually distributing paper tokens
- Hand-writing prescription slips
- Losing or misplacing tokens
- Confusion about patient queue order

Instead, MedSlip provides:
- A **Patient Mobile App** where patients can register, select services, pay online, and get a unique digital token
- An **ATM-like Kiosk** where patients enter their token and get a printed prescription slip
- A **Backend Server** that manages all data, validates tokens, processes payments, and prevents fraud

---

## The Problem It Solves

### Traditional Hospital Problems:
| Problem | MedSlip Solution |
|---------|-----------------|
| Long queues at reception | Self-service via mobile app |
| Manual token distribution | Auto-generated unique digital tokens |
| Handwritten prescription slips | Automated thermal-style printing |
| Lost paper tokens | Token stored in app + SMS/email |
| Queue jumping | Validated sequential processing |
| Duplicate or fake tokens | Cryptographic token generation + DB validation |
| Unpaid services | Integrated payment verification |
| Reprint confusion | One-time print with status tracking |

---

## System Flow Overview

```
PATIENT APP                          ATM KIOSK
============                         ==========

[Enter Details]                      
      ↓                              
[Select Service]                     
      ↓                              
[Confirm Info]                       
      ↓                              
[Generate Token] ←─── Token ───→ [Enter Token]
      ↓                              
[Pay Online]          [Validate Token]
      ↓                    ↓ failed  
[View Token]      ←──  Show Error
                         ↓ valid    
                    [Show Prescription]
                         ↓          
                    [Print Slip]     
                         ↓          
                    [Done - Token 
                     marked used]
```

---

## Who Uses the System?

### 1. Patients
- Open the Patient App on their phone
- Enter personal details (name, age, gender, phone)
- Select a medical service/department (Cardiology, General Medicine, Dentistry, etc.)
- Confirm details and generate a unique token
- If the service requires payment, pay online via Razorpay
- Receive a token number (e.g., `MS-ATM-A1B2C3D4`)
- Go to the ATM Kiosk in the hospital
- Enter the token number on the kiosk touchscreen
- Take the printed prescription slip to the doctor

### 2. Hospital Staff
- Do NOT need to manually create tokens or write prescriptions
- Patients self-serve via the app and kiosk
- Staff can focus on medical care

### 3. Hospital Administration
- All tokens, patients, and payments are tracked in the database
- Auditable trail of all prescriptions printed

---

## Detailed Step-by-Step Flow

### Phase 1: Patient Registration (Patient App)

**Step 1: Enter Patient Details**
- Screen: `/` (Home/PatientForm)
- Fields: Full Name, Age, Gender, Phone Number, Email (optional), Preferred Doctor (optional)
- Validation: 
  - Name: Required, not empty
  - Age: Required, 0-120
  - Gender: Required, select from Male/Female/Other
  - Phone: Required, exactly 10 digits
  - Email: Optional but valid format if provided
- On success: Data saved to localStorage, navigates to Service Selection

**Step 2: Select Medical Service**
- Screen: `/service` (ServiceSelection)
- Available Services:
  | Service | Fee | Icon |
  |---------|-----|------|
  | General Medicine | Free | 🩺 |
  | Cardiology | ₹500 | ❤️ |
  | Dentistry | ₹300 | 🦷 |
  | Orthopedics | ₹400 | 🦴 |
  | Pediatrics | Free | 👶 |
  | Ophthalmology | ₹250 | 👁️ |
  | Dermatology | ₹350 | 🧴 |
  | ENT | Free | 👂 |
- User taps a service card to select it (highlighted in green)
- On next: Service saved to localStorage, navigates to Confirmation

**Step 3: Confirm Details**
- Screen: `/confirm` (Confirmation)
- Shows summary of all entered info
- User can review and confirm
- On confirm: Sends all data to backend API (`POST /api/patient/create`)
- Backend creates Patient record in MongoDB
- Backend generates unique token (format: `MS-ATM-XXXXXXXX`)
- Backend creates Token record with status `pending`

**Step 4: Payment (if required)**
- If service requires payment:
  - Backend creates Razorpay order (`POST /api/payment/order`)
  - Razorpay checkout modal opens
  - User enters test card details: `4111 1111 1111 1111` (any future date, any CVV)
  - On payment success: Backend verifies signature (`POST /api/payment/verify`)
  - Token status updated to `paid`
- If service is free: Token status stays as `paid` (set during creation)

**Step 5: View Token**
- Screen: `/token` (TokenDisplay)
- Shows the generated token number in large text
- Token details: Department, generated time, expiry time (24 hours), status
- "Copy Token" button copies token to clipboard
- Instructions: "Take this token to the ATM Kiosk to print your slip"

### Phase 2: ATM Kiosk (Token to Slip)

**Step 6: Enter Token**
- Screen: ATM Kiosk (http://localhost:5174)
- Shows a large "TOKEN ENTRY" heading
- Alphanumeric keypad with buttons: 1-9, 0, A-F, dash (-), Clear, Submit
- User taps the keys to enter their token (e.g., `MS-ATM-A1B2C3D4`)
- Display area shows the entered token

**Step 7: Token Validation**
- User taps "Submit Token"
- Loading screen appears with spinning animation
- Backend validates (`POST /api/atm/validate`):
  - **Token exists?** → If not, "Invalid token - not found in system"
  - **Token already used?** → "Token already used. Cannot print again."
  - **Token expired?** → "Token has expired. Please generate a new one."
  - **Token pending (unpaid)?** → "Payment required before printing"
  - **Token valid (paid)?** → Success! Token marked as `used`, printedAt timestamp recorded

**Step 8: Prescription Slip Preview**
- Shows thermal receipt-style preview on screen
- Content:
  - Hospital name (from .env: HOSPITAL_NAME)
  - "Automated Prescription Slip"
  - Token number (large)
  - Patient details: Name, Age/Gender, Department, Doctor, Phone
  - Printed date/time
  - Footer: "This is a computer-generated prescription slip"

**Step 9: Print Slip**
- User taps "Print Slip" button
- System generates a PDF using jsPDF (80mm thermal paper format)
- PDF opens in new browser tab
- Browser print dialog opens automatically
- User selects printer (or "Save as PDF")
- After printing, system returns to token entry screen for next user

### Security Checks Throughout Flow:
- ✅ Duplicate token generation → MongoDB unique constraint prevents
- ✅ Invalid token → 404 response with error message
- ✅ Unpaid token → 400 response, blocked from printing
- ✅ Already used token → 400 response, blocked from reprinting
- ✅ Expired token → 400 response, blocked
- ✅ Fake payment → Razorpay HMAC signature verification prevents

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend (Patient App)** | React 18 + Vite + TailwindCSS 3 | Mobile-responsive patient interface |
| **Frontend (ATM Kiosk)** | React 18 + Vite + TailwindCSS 3 + jsPDF | Fullscreen kiosk interface + PDF generation |
| **Backend API** | Node.js 18+ + Express 4 | REST API server |
| **Database** | MongoDB + Mongoose 7 | Data persistence |
| **Payment** | Razorpay Checkout | Online payment processing |
| **Validation** | Joi | Request data validation |
| **Routing** | React Router 6 | Client-side navigation |
| **HTTP Client** | Axios | API communication |
| **Auth** | JWT (jsonwebtoken) | Optional authentication |
| **Security** | express-rate-limit | Rate limiting protection |
| **Printing** | jsPDF | Thermal-compatible PDF generation |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT TIER                             │
│                                                              │
│  ┌─────────────────────┐    ┌───────────────────────────┐   │
│  │   Patient App        │    │    ATM Kiosk              │   │
│  │   (React + Vite)     │    │    (React + Vite)         │   │
│  │   :5173              │    │    :5174                  │   │
│  └──────────┬───────────┘    └───────────┬───────────────┘   │
│             │                            │                    │
└─────────────┼────────────────────────────┼────────────────────┘
              │         HTTP/JSON          │
              ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API TIER                                │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │   Express.js Server :5000     │                │
│              │                              │                │
│              │  /api/patient/*              │                │
│              │  /api/payment/*              │                │
│              │  /api/atm/*                  │                │
│              │  /api/health                 │                │
│              └──────────────┬───────────────┘                │
│                             │                                │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA TIER                                  │
│                                                              │
│              ┌──────────────────────────────┐                │
│              │   MongoDB Database            │                │
│              │                              │                │
│              │   Collections:               │                │
│              │   - patients                 │                │
│              │   - tokens                   │                │
│              │   - payments                 │                │
│              └──────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
medslip-system/                              # ROOT
│
├── README.md                                # This file
│
├── server/                                  # BACKEND API
│   ├── server.js                            # Entry point - Express setup
│   ├── package.json                         # Dependencies
│   ├── .env                                 # Environment variables
│   ├── .env.example                         # Template for .env
│   │
│   ├── models/                              # MongoDB schemas
│   │   ├── Patient.js                       # Patient data model
│   │   ├── Token.js                         # Token data model
│   │   └── Payment.js                       # Payment data model
│   │
│   ├── routes/                              # Express route definitions
│   │   ├── patientRoutes.js                 # /api/patient/* routes
│   │   ├── paymentRoutes.js                 # /api/payment/* routes
│   │   └── atmRoutes.js                     # /api/atm/* routes
│   │
│   ├── controllers/                         # Business logic
│   │   ├── patientController.js             # Patient + token creation logic
│   │   ├── paymentController.js             # Razorpay order + verification
│   │   └── atmController.js                 # Token validation + print trigger
│   │
│   ├── middleware/                          # Express middleware
│   │   ├── validation.js                    # Joi schema validation
│   │   └── auth.js                          # JWT auth (optional)
│   │
│   └── utils/                               # Helper utilities
│       ├── tokenGenerator.js                # Unique token generation
│       └── razorpay.js                      # Razorpay SDK instance
│
├── client/                                  # PATIENT APP (Frontend)
│   ├── index.html                           # HTML entry point
│   ├── package.json                         # Dependencies
│   ├── vite.config.js                       # Vite configuration
│   ├── tailwind.config.js                   # TailwindCSS config + custom colors
│   ├── postcss.config.js                    # PostCSS config
│   ├── .env                                 # Env variables
│   │
│   └── src/
│       ├── main.jsx                         # React entry point
│       ├── App.jsx                          # Root component + routing
│       ├── index.css                        # Global styles + Tailwind imports
│       │
│       ├── pages/                           # Screen components
│       │   ├── PatientForm.jsx              # Step 1: Patient details form
│       │   ├── ServiceSelection.jsx         # Step 2: Department selection
│       │   ├── Confirmation.jsx             # Step 3: Review + confirm + payment
│       │   └── TokenDisplay.jsx             # Step 4: Token display screen
│       │
│       ├── components/                      # Reusable UI components
│       │   ├── FormInput.jsx                # Text input with validation
│       │   ├── ServiceCard.jsx              # Service selection card
│       │   ├── PaymentButton.jsx            # Razorpay payment button
│       │   └── ProgressStepper.jsx          # Step indicator bar
│       │
│       └── services/                        # API integration
│           └── api.js                       # Axios instance + API methods
│
└── kiosk/                                   # ATM KIOSK APP
    ├── index.html                           # HTML entry point (fullscreen)
    ├── package.json                         # Dependencies
    ├── vite.config.js                       # Vite config (port 5174)
    ├── tailwind.config.js                   # TailwindCSS config
    ├── postcss.config.js                    # PostCSS config
    ├── .env                                 # Env variables
    │
    └── src/
        ├── main.jsx                         # React entry point
        ├── App.jsx                          # Root component (state machine)
        ├── index.css                        # Global styles
        │
        ├── pages/                           # Screen components
        │   ├── ATM.jsx                      # Token entry screen
        │   └── PrintSlip.jsx                # Prescription preview + print
        │
        ├── components/                      # UI components
        │   └── Keypad.jsx                   # Alphanumeric keypad
        │
        ├── services/                        # API integration
        │   └── api.js                       # Axios instance
        │
        └── utils/                           # Helper utilities
            └── print.js                     # PDF slip generation
```

---

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Check version: `node --version`

2. **npm** (comes with Node.js)
   - Check version: `npm --version`

3. **MongoDB** (local or cloud)
   - **Local option:** Download MongoDB Community Server from https://www.mongodb.com/try/download/community
   - **Cloud option:** Create free cluster at https://www.mongodb.com/atlas (get connection string)

4. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

5. **Razorpay Test Account** (for payment testing)
   - Sign up at: https://dashboard.razorpay.com/
   - Get test API keys from Settings → API Keys

6. **A Modern Web Browser** (Chrome, Firefox, Edge)

7. **Code Editor** (VS Code recommended)

---

## Complete Setup Guide

### Step 1: Navigate to Project

```bash
cd medslip-system
```

### Step 2: Start MongoDB

**If using local MongoDB:**
```bash
# Start MongoDB service (Windows)
net start MongoDB

# OR if using MongoDB Community Server
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# OR simply ensure MongoDB Compass is running
```

**If using MongoDB Atlas (cloud):**
- Get your connection string from Atlas dashboard
- You'll need it for the `.env` file below

### Step 3: Setup Backend

```bash
cd medslip-system/server
npm install
```

**Configure the `.env` file:**
```bash
# server/.env already exists, edit with your values:
PORT=5000
DB_URI=mongodb://localhost:27017/medslip    # Change if using Atlas
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx        # Your Razorpay test key ID
RAZORPAY_KEY_SECRET=your_test_secret         # Your Razorpay test secret
HOSPITAL_NAME=MedSlip Hospital               # Change to your hospital name
JWT_SECRET=your_jwt_secret_here              # Any random string
```

### Step 4: Setup Patient App

```bash
cd medslip-system/client
npm install
```

**Check the `.env` file:**
```bash
# client/.env should already exist:
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx   # Same key ID as above
```

### Step 5: Setup ATM Kiosk

```bash
cd medslip-system/kiosk
npm install
```

**Check the `.env` file:**
```bash
# kiosk/.env should already exist:
VITE_API_URL=http://localhost:5000/api
```

---

## Running the System

You need **3 terminal windows** to run all parts simultaneously.

### Terminal 1: Start Backend Server

```bash
cd medslip-system/server
npm start
```

**Expected output:**
```
> medslip-server@1.0.0 start
> node server.js

MedSlip server running on port 5000
MongoDB connected successfully
```

**Alternative with auto-restart (nodemon):**
```bash
npm run dev
```

### Terminal 2: Start Patient App

```bash
cd medslip-system/client
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

Open **http://localhost:5173** in your browser.

### Terminal 3: Start ATM Kiosk

```bash
cd medslip-system/kiosk
npm run dev
```

**Expected output:**
```
VITE v4.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/
➜  Network: http://192.168.x.x:5174/
```

Open **http://localhost:5174** in your browser (preferably in a separate window or tablet).

**For fullscreen kiosk mode (on tablet/phone):**
```bash
npm run kiosk
```
Then access `http://<your-ip>:5174` from another device on the same network.

---

## End-to-End Testing Guide

Follow these steps to test the complete system flow:

### Part 1: Patient App Flow

**Step 1: Open Patient App**
- Open browser at http://localhost:5173
- You'll see the **Patient Details** screen
- Progress stepper shows: Details (active) → Service → Confirm → Token

**Step 2: Enter Patient Details**
- Fill in the form:
  - **Full Name:** Rahul Sharma
  - **Age:** 35
  - **Gender:** Male (select from dropdown)
  - **Phone:** 9876543210
  - **Email:** rahul@example.com (optional)
  - **Preferred Doctor:** Dr. Gupta (optional)
- Click "Next: Select Service →"
- ✅ No errors should appear if validation passes
- ✅ You navigate to the Service Selection screen

**Step 3: Select a Service**
- You'll see a grid of 8 medical services with icons
- Click on **"Cardiology"** (it should highlight with a green border)
- Note: Cardiology costs ₹500 (paid service)
- Click "Next: Confirm Details →"
- ✅ Service is selected, navigated to Confirmation

**Step 4: Confirm Details**
- Review your information:
  - Name: Rahul Sharma
  - Age / Gender: 35 / Male
  - Phone: 9876543210
  - Department: Cardiology
  - Doctor: Dr. Gupta
- Click **"Confirm & Generate Token"**
- ✅ **API creates:** Patient record + Token record (status: pending)
- ✅ **Razorpay order created** (since Cardiology requires payment)
- ✅ **Payment button appears** showing "Pay Now ₹500"

**Step 5: Complete Payment**
- Click **"Pay Now ₹500"**
- Razorpay checkout modal opens
- Enter test card details:
  - **Card Number:** `4111 1111 1111 1111`
  - **Card Expiry:** Any future date (e.g., 12/28)
  - **CVV:** Any 3 digits (e.g., 123)
  - **Name:** Rahul Sharma
- Click "Pay"
- ✅ **Payment verified** by backend signature check
- ✅ **Token status updated** from "pending" to "paid"
- ✅ You navigate to Token Display screen

**Step 6: View Your Token**
- You'll see a success banner: "✓ Token Generated Successfully!"
- Your token number appears in large green text: **MS-ATM-A1B2C3D4**
- Details shown:
  - Department: Cardiology
  - Generated: 5/8/2026, 9:30:00 PM
  - Valid Until: 5/9/2026, 9:30:00 PM
  - Status: paid
- Click **"Copy Token"** → "✓ Copied!" confirmation appears
- ✅ Token is now ready to use at the ATM kiosk

### Part 2: ATM Kiosk Flow

**Step 7: Open ATM Kiosk**
- Open browser at http://localhost:5174
- You'll see a dark-themed screen with "🏥 MedSlip ATM" at top
- Below: "TOKEN ENTRY" heading with an alphanumeric keypad

**Step 8: Enter Your Token**
- Using the keypad, enter the token you copied: `MS-ATM-A1B2C3D4`
  - Tap: M, S, -, A, T, M, -, A, 1, B, 2, C, 3, D, 4
  - Notes: 
    - The token format is `MS-ATM-XXXXXXXX` (uppercase letters A-F + digits)
    - Keypad includes letters A-F, digits 0-9, and dash (-)
    - Use "Clear" to reset the input
- Watch the display area update as you type
- Click **"Submit Token"** (green button below keypad)

**Step 9: Token Validation**
- ✅ **Loading animation** appears with "Validating token..." message
- ✅ **Backend checks:** Token exists → is paid → not expired → not already used
- ✅ **Token marked as "used"** → status changes from "paid" to "used"
- ✅ **Printed timestamp recorded** in database
- ✅ **Prescription preview screen** appears

**Step 10: View Prescription Slip**
- You'll see a white thermal receipt-style preview:
  ```
  ┌──────────────────────────────┐
  │     MedSlip Hospital          │
  │  Automated Prescription Slip  │
  │──────────────────────────────│
  │   Token: MS-ATM-A1B2C3D4     │
  │──────────────────────────────│
  │  Patient:      Rahul Sharma  │
  │  Age/Gender:   35 / Male      │
  │  Department:   Cardiology     │
  │  Doctor:       Dr. Gupta      │
  │  Phone:        9876543210     │
  │──────────────────────────────│
  │  Printed: 5/8/2026, 9:35 PM  │
  │──────────────────────────────│
  │  Computer-generated slip      │
  │  Valid only with hospital     │
  │  stamp                        │
  └──────────────────────────────┘
  ```

**Step 11: Print the Slip**
- Click **"🖨️ Print Slip"** button
- ✅ A new browser tab opens with the PDF
- ✅ Browser print dialog appears automatically
- You can:
  - Select a physical printer (if connected)
  - Select "Save as PDF" to save the file
  - Click Cancel to just view
- After printing/cancelling, return to the kiosk tab
- ✅ Kiosk automatically resets to token entry screen

### Part 3: Verification Tests

**Test 1: Verify Token Cannot Be Used Again**
1. Copy the same token (`MS-ATM-A1B2C3D4`) again
2. Enter it in the kiosk
3. Submit
4. ✅ You should see: **⚠️ Token already used. Cannot print again.**
5. Click "Try Again" to reset

**Test 2: Verify Invalid Token**
1. Enter a fake token like `INVALID-TOKEN`
2. Submit
3. ✅ You should see: **⚠️ Invalid token - not found in system**

**Test 3: Verify Unpaid Token Cannot Print**
1. Go to patient app and register a new patient
2. Select a free service like "General Medicine"
3. Confirm and generate token (no payment needed since it's free)
4. Try entering this token in the kiosk
5. ✅ Should succeed since free services are automatically marked as paid

**Test 4: Verify Token Expiry (if you want to test)**
1. Generate a token
2. Wait 24 hours (or manually update the `expiresAt` in MongoDB to the past)
3. Try to use it at the kiosk
4. ✅ Should show: **Token has expired. Please generate a new one.**

---

## API Reference

All API endpoints are prefixed with `/api`.

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "MedSlip API is running"
}
```

### Patient Routes

#### Create Patient + Generate Token
```
POST /api/patient/create
```

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "age": 35,
  "gender": "Male",
  "phone": "9876543210",
  "email": "rahul@example.com",
  "department": "Cardiology",
  "doctor": "Dr. Gupta"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "patientId": "664a1b2c3d4e5f6a7b8c9d0e",
  "tokenId": "MS-ATM-A1B2C3D4",
  "message": "Patient and token created successfully"
}
```

**Error Response (400) - Validation Failed:**
```json
{
  "error": "\"phone\" with value \"123\" fails to match the required pattern"
}
```

#### Get Token Details
```
POST /api/patient/token-details
```

**Request Body:**
```json
{
  "tokenId": "MS-ATM-A1B2C3D4"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": {
    "tokenId": "MS-ATM-A1B2C3D4",
    "status": "paid",
    "patientId": {
      "name": "Rahul Sharma",
      "age": 35,
      "gender": "Male",
      "department": "Cardiology",
      "doctor": "Dr. Gupta"
    },
    "generatedAt": "2026-05-08T16:00:00.000Z",
    "expiresAt": "2026-05-09T16:00:00.000Z"
  },
  "requiresPayment": false
}
```

### Payment Routes

#### Create Razorpay Order
```
POST /api/payment/order
```

**Request Body:**
```json
{
  "tokenId": "MS-ATM-A1B2C3D4",
  "amount": 500
}
```

**Success Response (200):**
```json
{
  "success": true,
  "orderId": "order_OIx1y2Z3a4b5c6d",
  "amount": 500,
  "currency": "INR",
  "key": "rzp_test_xxxxxxxxxxxx"
}
```

#### Verify Payment
```
POST /api/payment/verify
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_OIx1y2Z3a4b5c6d",
  "razorpayPaymentId": "pay_OIx1y2Z3a4b5c6d",
  "razorpaySignature": "crypto_signature_hash",
  "tokenId": "MS-ATM-A1B2C3D4"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment verified"
}
```

**Error Response (400) - Invalid Signature:**
```json
{
  "error": "Invalid signature"
}
```

### ATM Routes

#### Validate Token (for printing)
```
POST /api/atm/validate
```

**Request Body:**
```json
{
  "tokenId": "MS-ATM-A1B2C3D4"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token validated successfully. Ready to print.",
  "slipData": {
    "hospitalName": "MedSlip Hospital",
    "tokenId": "MS-ATM-A1B2C3D4",
    "patientName": "Rahul Sharma",
    "age": 35,
    "gender": "Male",
    "department": "Cardiology",
    "doctor": "Dr. Gupta",
    "phone": "9876543210",
    "generatedAt": "2026-05-08T16:00:00.000Z",
    "printedAt": "2026-05-08T16:05:00.000Z"
  }
}
```

**Error Responses:**

Token not found:
```json
{
  "error": "Invalid token - not found in system"
}
```

Token already used:
```json
{
  "error": "Token already used. Cannot print again."
}
```

Token expired:
```json
{
  "error": "Token has expired. Please generate a new one."
}
```

Payment required:
```json
{
  "error": "Payment required before printing. Please complete payment first."
}
```

#### Trigger Print
```
POST /api/atm/print
```

Same as validate, but specifically for the kiosk print button. Same request/response format.

---

## Database Models

### Patient Model
```javascript
{
  name: String,           // Required, max 100 chars
  age: Number,            // Required, 0-120
  gender: String,         // Required, "Male" | "Female" | "Other"
  phone: String,          // Required, exactly 10 digits
  email: String,          // Optional, email format
  department: String,     // Required, max 50 chars
  doctor: String,         // Optional, max 100 chars
  createdAt: Date,        // Auto-set
  updatedAt: Date         // Auto-set (timestamps: true)
}
```

### Token Model
```javascript
{
  tokenId: String,        // Required, unique, format: "MS-ATM-XXXXXXXX"
  patientId: ObjectId,    // Reference to Patient model
  status: String,         // "pending" | "paid" | "used" | "expired"
  paymentId: String,      // Razorpay order ID (optional)
  generatedAt: Date,      // Auto-set
  expiresAt: Date,        // Default: generatedAt + 24 hours
  printedAt: Date,        // Set when printed (optional)
  createdAt: Date,        // Auto-set
  updatedAt: Date         // Auto-set
}
// Indexes: tokenId (unique), status
```

### Payment Model
```javascript
{
  razorpayOrderId: String,     // Required, unique
  razorpayPaymentId: String,   // Required
  razorpaySignature: String,   // Required
  tokenId: ObjectId,           // Reference to Token model
  amount: Number,              // Required, in rupees
  currency: String,            // Default: "INR"
  status: String,              // "created" | "paid" | "failed"
  paidAt: Date,                // Set when paid
  createdAt: Date,             // Auto-set
  updatedAt: Date              // Auto-set
}
```

---

## Security Features

### 1. Input Validation
- **Frontend:** Form validation before submission (required fields, formats)
- **Backend:** Joi schema validation on all API endpoints
- Invalid data returns 400 with specific error message

### 2. Unique Token Generation
- Tokens use UUID-based algorithm: `MS-ATM-XXXXXXXX`
- MongoDB unique index prevents duplicate token creation
- Retry logic (up to 5 attempts) to ensure uniqueness

### 3. Token Status Validation
Before printing, the ATM validates all status checks:
- **Not found?** → Reject (404)
- **Already used?** → Reject (400)
- **Expired (>24h)?** → Reject (400)
- **Unpaid?** → Reject (400)
- **Valid?** → Mark as used, allow print

### 4. Payment Security
- Razorpay order created with unique receipt ID
- Payment verified using HMAC SHA-256 signature
- Signature = `HMAC-SHA256(order_id + "|" + payment_id, key_secret)`
- Prevents fake/forged payment confirmations

### 5. Rate Limiting
- express-rate-limit: 100 requests per 15 minutes per IP
- Prevents brute force attacks on token validation

### 6. CORS Protection
- Only specific origins allowed: localhost:5173, localhost:5174
- Prevents unauthorized websites from accessing the API

### 7. Token Expiry
- Tokens expire after 24 hours
- Expired tokens cannot be used for printing
- Prevents stale/abandoned tokens from being used

---

## Payment Integration

### How Razorpay Works in This System

1. **Backend creates order:**
   - `POST /api/payment/order` calls Razorpay API
   - Razorpay returns `order_id`
   - Order saved in Payment collection (status: "created")

2. **Frontend opens Razorpay Checkout:**
   - PaymentButton component loads Razorpay script dynamically
   - Opens checkout modal with order details
   - User enters card details

3. **User completes payment:**
   - Razorpay processes payment
   - Returns `payment_id` + `signature` to frontend handler

4. **Frontend sends verification:**
   - `POST /api/payment/verify` sends order_id, payment_id, signature
   - Backend computes HMAC and compares signatures
   - If match: Payment marked "paid", Token status updated to "paid"
   - If mismatch: Rejected as invalid signature

### Test Card Details
For testing in development mode:
| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., 12/28) |
| CVV | Any 3 digits (e.g., 123) |
| Name | Any name |
| 3D Secure Password | (if asked) Use any password |

---

## Printing System

### How Printing Works

The ATM Kiosk uses **jsPDF** to generate a PDF document formatted for thermal receipt printers (80mm width).

### Thermal Paper Format
- **Width:** 80mm (standard thermal roll)
- **Height:** Auto-calculated based on content (~120mm)
- **Font:** Courier (monospace, looks like actual receipts)
- **Orientation:** Portrait

### PDF Content Layout
```
┌────────────────────────────────────┐
│      MedSlip Hospital              │  ← Font size 16, Bold, Centered
│   Automated Prescription Slip      │  ← Font size 10
├────────────────────────────────────┤
│                                    │
│   Token: MS-ATM-A1B2C3D4          │  ← Font size 14, Bold, Centered
│                                    │
├────────────────────────────────────┤
│                                    │
│  Patient:      Rahul Sharma        │  ← Font size 10
│  Age/Gender:   35 / Male           │
│  Department:   Cardiology          │
│  Doctor:       Dr. Gupta           │
│  Phone:        9876543210          │
│                                    │
├────────────────────────────────────┤
│                                    │
│  Printed: 5/8/2026, 9:35 PM       │  ← Font size 8
│                                    │
├────────────────────────────────────┤
│ This is a computer-generated       │  ← Font size 7
│ prescription slip                  │
│ Valid only with hospital stamp     │
└────────────────────────────────────┘
```

### Printing Options
1. **Browser Print Dialog:** Opens automatically when user clicks "Print Slip"
2. **Save as PDF:** User can save the file instead of printing
3. **Real Thermal Printer:** For hospital deployment, connect to a thermal printer (e.g., Epson TM-T20) via USB

### Real Thermal Printer Setup (for Production)
If deploying on a Raspberry Pi with a thermal printer:
```bash
npm install node-thermal-printer
```
Then modify `kiosk/src/utils/print.js` to send raw data to the printer instead of generating a PDF.

---

## UI Screens Guide

### Patient App Screens

#### Screen 1: Patient Details
```
┌─────────────────────────────┐
│ 🏥 MedSlip Hospital         │ ← Green header
│ Automated Token System      │
├─────────────────────────────┤
│  ① Details ─ ② Service ─ ③ Confirm ─ ④ Token  │ ← Progress bar
├─────────────────────────────┤
│                             │
│    🏥 Patient Details       │
│                             │
│  Full Name                  │
│  ┌─────────────────────┐   │
│  │ Rahul Sharma        │   │
│  └─────────────────────┘   │
│                             │
│  Age                        │
│  ┌─────────────────────┐   │
│  │ 35                  │   │
│  └─────────────────────┘   │
│                             │
│  Gender                     │
│  ┌─────────────────────┐   │
│  │ Male    ▼           │   │
│  └─────────────────────┘   │
│                             │
│  Phone Number               │
│  ┌─────────────────────┐   │
│  │ 9876543210          │   │
│  └─────────────────────┘   │
│                             │
│  Email (Optional)           │
│  ┌─────────────────────┐   │
│  │ rahul@example.com   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Next: Select Service│   │ ← Green button
│  │        →            │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

#### Screen 2: Service Selection
```
┌─────────────────────────────┐
│ Select Service               │
│ Choose the department you   │
│ need                        │
│                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 🩺   │ │ ❤️   │ │ 🦷   │ │
│ │General│ │Cardio│ │Dent  │ │
│ │ Med   │ │logy  │ │istry │ │
│ │ Free  │ │₹500  │ │₹300  │ │
│ └──────┘ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ 🦴   │ │ 👶   │ │ 👁️   │ │
│ │Ortho │ │Pedia │ │Ophth │ │
│ │₹400  │ │Free  │ │₹250  │ │
│ └──────┘ └──────┘ └──────┘ │
│ ┌──────┐ ┌──────┐          │
│ │ 🧴   │ │ 👂   │          │
│ │Derma │ │ ENT  │          │
│ │₹350  │ │Free  │          │
│ └──────┘ └──────┘          │
│                             │
│  ┌─────────────────────┐   │
│  │ Next: Confirm →     │   │
│  └─────────────────────┘   │
└─────────────────────────────┘
```

#### Screen 3: Confirmation
```
┌─────────────────────────────┐
│ Confirm Details              │
│                             │
│ ┌─────────────────────────┐ │
│ │ Name:      Rahul Sharma │ │
│ │ Age/Gender: 35 / Male   │ │
│ │ Phone:     9876543210   │ │
│ │ Dept:      Cardiology   │ │
│ │ Doctor:    Dr. Gupta    │ │
│ └─────────────────────────┘ │
│                             │
│  ┌─────────────────────┐   │
│  │ Confirm & Generate  │   │
│  │ Token               │   │
│  └─────────────────────┘   │
│                             │
│    ← Change Service         │
└─────────────────────────────┘
```

#### Screen 4: Payment (if required)
```
┌─────────────────────────────┐
│ Confirm Details              │
│                             │
│ (Details summary)           │
│                             │
│ Amount to pay: ₹500         │
│                             │
│  ┌─────────────────────┐   │
│  │ Pay Now ₹500        │   │
│  └─────────────────────┘   │
│                             │
│    ← Change Service         │
└─────────────────────────────┘
```
*(Razorpay modal opens on button click)*

#### Screen 5: Token Display
```
┌─────────────────────────────┐
│  ✓ Token Generated!         │ ← Green success banner
│                             │
│  ┌─────────────────────┐   │
│  │    Your Token        │   │
│  │                     │   │
│  │ MS-ATM-A1B2C3D4     │   │ ← Large green text
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  [📋 Copy Token]            │
│                             │
│  Take this token to the     │
│  ATM Kiosk to print your    │
│  prescription slip          │
│                             │
│  ┌─────────────────────┐   │
│  │ Department: Cardio  │   │
│  │ Generated: 9:30 PM  │   │
│  │ Expires: 9:30 PM tmw│   │
│  │ Status: paid         │   │
│  └─────────────────────┘   │
│                             │
│  Start New Entry →          │
└─────────────────────────────┘
```

### ATM Kiosk Screens

#### Screen 1: Token Entry
```
┌─────────────────────────────────────┐
│         🏥 MedSlip ATM              │ ← Green text, dark bg
│    Enter your token to print        │
│                                     │
│   ┌─────────────────────────────┐  │
│   │    TOKEN ENTRY              │  │
│   └─────────────────────────────┘  │
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Enter your token number     │  │
│   │                             │  │
│   │   MS-ATM-A1B2C3D4          │  │ ← Token display
│   └─────────────────────────────┘  │
│                                     │
│   ┌───┐ ┌───┐ ┌───┐               │
│   │ 1 │ │ 2 │ │ 3 │               │ ← Keypad
│   └───┘ └───┘ └───┘               │
│   ┌───┐ ┌───┐ ┌───┐               │
│   │ 4 │ │ 5 │ │ 6 │               │
│   └───┘ └───┘ └───┘               │
│   ┌───┐ ┌───┐ ┌───┐               │
│   │ 7 │ │ 8 │ │ 9 │               │
│   └───┘ └───┘ └───┘               │
│   ┌───┐ ┌───┐ ┌───┐               │
│   │ A │ │ 0 │ │ B │               │
│   └───┘ └───┘ └───┘               │
│   ┌───┐ ┌───┐ ┌───┐               │
│   │ C │ │ D │ │ E │               │
│   └───┘ └───┘ └───┘               │
│   ┌───┐ ┌───┐ ┌──────┐           │
│   │ F │ │ - │ │ Clear│           │ ← Red
│   └───┘ └───┘ └──────┘           │
│                                     │
│   ┌─────────────────────────────┐  │
│   │      Submit Token           │  │ ← Green full width
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Screen 2: Loading/Validating
```
┌─────────────────────────────────────┐
│                                     │
│           ◌                         │ ← Spinning animation
│                                     │
│     Validating token...             │
│                                     │
│        ● ● ●                       │ ← Bouncing dots
│                                     │
└─────────────────────────────────────┘
```

#### Screen 3: Error
```
┌─────────────────────────────────────┐
│                                     │
│            ⚠️                       │
│                                     │
│  Token already used. Cannot         │
│  print again.                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Try Again            │   │
│  └─────────────────────────────┘   │
│                                     │
│       Reset System                  │
│                                     │
└─────────────────────────────────────┘
```

#### Screen 4: Prescription Preview
```
┌─────────────────────────────────────┐
│    Printing Prescription             │
│  Preview and print the slip         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     MedSlip Hospital        │   │ ← White receipt
│  │  Automated Prescription     │   │    preview
│  │                             │   │
│  │  Token: MS-ATM-A1B2C3D4    │   │
│  │                             │   │
│  │  Patient:     Rahul Sharma  │   │
│  │  Age/Gender:  35 / Male     │   │
│  │  Department:  Cardiology    │   │
│  │  Doctor:      Dr. Gupta     │   │
│  │  Phone:       9876543210    │   │
│  │                             │   │
│  │  Printed: 5/8/2026, 9:35PM │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     🖨️ Print Slip          │   │ ← Green button
│  └─────────────────────────────┘   │
│                                     │
│      ← Cancel & Return              │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### Common Issues and Solutions

#### Server won't start
| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| `Cannot find module 'joi'` | Missing dependency | Run `npm install` in server/ |
| `Cannot find module 'express-rate-limit'` | Missing dependency | Run `npm install express-rate-limit` in server/ |
| `key_id or oauthToken is mandatory` | Razorpay keys not configured | Update server/.env with valid keys |
| `MongoDB connection error` | MongoDB not running | Start MongoDB service or check Atlas URI |
| `Port 5000 already in use` | Another process on port | Change PORT in .env or kill the other process |

#### Patient App won't load
| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| `http://localhost:5173` shows blank page | Dev server not started | Run `npm run dev` in client/ |
| API calls fail with CORS error | Backend not running | Start server with `npm start` in server/ |
| `Failed to submit` error | Backend not reachable | Check API URL in client/.env |
| Razorpay not opening | Script loading failed | Check internet connection |

#### ATM Kiosk won't load
| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| `http://localhost:5174` shows blank page | Dev server not started | Run `npm run dev` in kiosk/ |
| Token validation fails | Backend not running | Start server first |
| Print button does nothing | jsPDF not loaded | Check kiosk dependencies |
| Keypad typing doesn't work | Component not rendering | Check browser console for errors |

#### Token Issues
| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| "Token not found" | Wrong token entered | Check the token format (MS-ATM-XXXXXXXX) |
| "Token already used" | Already printed | Generate a new token from the app |
| "Payment required" | Token not paid | Complete payment in the app first |
| "Token expired" | More than 24h passed | Generate a new token |

### Debugging Tips

1. **Check Browser Console:** Press F12 → Console tab to see JavaScript errors
2. **Check Network Tab:** Press F12 → Network tab to see API request/response details
3. **Check Server Logs:** The terminal running `npm start` shows all API requests
4. **Check MongoDB:** Use MongoDB Compass to view collections and verify data
5. **Razorpay Dashboard:** Check payment status at dashboard.razorpay.com

### Getting Help
- Review this README for setup and usage instructions
- Check error messages in browser console and server logs
- Verify all environment variables are correctly set

---

## Deployment Guide

### Deploying Backend (Render / Railway)

1. Push code to GitHub
2. Create account on Render.com or Railway.app
3. Connect your GitHub repository
4. Set environment variables:
   - `PORT`: 5000
   - `DB_URI`: Your MongoDB Atlas connection string
   - `RAZORPAY_KEY_ID`: Your production Razorpay key
   - `RAZORPAY_KEY_SECRET`: Your production Razorpay secret
   - `HOSPITAL_NAME`: Your hospital name
   - `JWT_SECRET`: A random secure string
5. Deploy

### Deploying Patient App (Vercel / Netlify)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., https://medslip-api.onrender.com/api)
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay key
5. Deploy

### Deploying ATM Kiosk (Vercel / Netlify or Local Server)

1. Same as Patient App deployment
2. Set environment variable:
   - `VITE_API_URL`: Your deployed backend URL
3. For hospital use, host on an internal server and access from kiosk devices

### Raspberry Pi Kiosk Setup
```bash
# Install Node.js on Raspberry Pi
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone project and install
git clone <your-repo>
cd medslip-system/kiosk
npm install

# Run in kiosk mode
npm run kiosk

# Set up browser to open on boot (add to /etc/xdg/lxsession/LXDE-pi/autostart)
@chromium-browser --kiosk --no-sandbox http://localhost:5174
```

### Production Considerations
- **HTTPS:** Use SSL certificates for all endpoints
- **Environment Variables:** Never commit real keys to GitHub
- **MongoDB Atlas:** Use production cluster with proper security
- **Rate Limiting:** Adjust limits based on expected traffic
- **Error Monitoring:** Add Sentry or similar for production error tracking
- **Backup:** Schedule regular MongoDB backups
- **Scaling:** Add Redis caching if handling high traffic

---

Built with ❤️ for hospital queue management.