# 🚀 MedSlip Vercel Deployment Guide

This guide explains how to deploy all 3 parts of the MedSlip system to Vercel.

## Overview

You need to create **3 separate Vercel projects**:

| Part | Directory | Framework | Purpose |
|------|-----------|-----------|---------|
| Backend API | `server/` | Node.js / Express | API + Database connection |
| Patient App | `client/` | Vite + React | Patient mobile interface |
| ATM Kiosk | `kiosk/` | Vite + React | Hospital kiosk interface |

---

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

---

## Step 2: Deploy Backend API (server/)

### 2a. Create Project on Vercel
1. Go to [vercel.com](https://vercel.com) and login
2. Click **Add New → Project**
3. Import your GitHub repository (`medslip-project`)
4. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `server` |
| **Framework Preset** | Other |
| **Build Command** | `npm run vercel-build` (auto-detected) |
| **Output Directory** | `.` (leave default) |

### 2b. Set Environment Variables
In the **Environment Variables** section, add these **MANDATORY** variables:

| Name | Value | Example |
|------|-------|---------|
| `MONGO_URI` | Your MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/medslip?retryWrites=true&w=majority` |
| `RAZORPAY_KEY_ID` | Your Razorpay test key ID | `rzp_test_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret key | `your_secret_here` |
| `HOSPITAL_NAME` | Hospital name | `MedSlip Hospital` |
| `JWT_SECRET` | Any random string | `med7768217528991265` |

> ⚠️ **IMPORTANT:** The `.env` file in your repo has real MongoDB credentials. These are now ignored by `.gitignore`, but if you already committed them, **rotate your MongoDB password immediately**.

### 2c. Deploy
- Click **Deploy**
- Wait for deployment to complete
- Copy the deployment URL (e.g., `https://medslip-server.vercel.app`)

### 2d. Verify Backend
Visit: `https://your-server-url.vercel.app/api/health`
✅ You should see: `{ "success": true, "message": "MedSlip API running on Vercel" }`

---

## Step 3: Deploy Patient App (client/)

### 3a. Create Project on Vercel
1. **Add New → Project**
2. Import the same repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3b. Set Environment Variables

| Name | Value | Example |
|------|-------|---------|
| `VITE_API_URL` | Your deployed server URL + `/api` | `https://medslip-server.vercel.app/api` |
| `VITE_RAZORPAY_KEY_ID` | Same Razorpay key ID | `rzp_test_xxxxxxxxxxxx` |

### 3c. Deploy
- Click **Deploy**

### 3d. Verify
✅ Open the deployment URL - you should see the Patient Details form.

---

## Step 4: Deploy ATM Kiosk (kiosk/)

### 4a. Create Project on Vercel
1. **Add New → Project**
2. Import the same repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `kiosk` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 4b. Set Environment Variables

| Name | Value | Example |
|------|-------|---------|
| `VITE_API_URL` | Your deployed server URL + `/api` | `https://medslip-server.vercel.app/api` |

### 4c. Deploy
- Click **Deploy**

---

## Step 5: End-to-End Testing

1. Open the Patient App URL → Fill details → Get token
2. Open the Kiosk URL → Enter token → Print slip
3. ✅ Everything should work online!

---

## Troubleshooting

### ❌ "No MongoDB URI configured" error
→ You forgot to add `MONGO_URI` in Vercel env vars for the server project.

### ❌ "Cannot reach API" / CORS errors in browser
→ Make sure `VITE_API_URL` in both `client` and `kiosk` Vercel projects points to `https://your-server-url.vercel.app/api`

### ❌ 404 on API routes
→ Make sure the server is deployed correctly. Check `https://your-server-url.vercel.app/api/health`

### ❌ Build fails for server
→ Ensure `vercel-build` script is in `server/package.json`. We've added it.

### ❌ MongoDB connection timeout
→ Your MongoDB Atlas may need IP whitelisting. Go to Atlas → Network Access → Add `0.0.0.0/0` (allows all IPs, including Vercel's dynamic IPs).

---

## Security Warning ⚠️

The `server/.env` file in this repository contains **real MongoDB credentials**. After deploying:

1. ✅ We've updated `.gitignore` to exclude all `.env` files from git
2. ❗ If the `.env` file was already committed to git history, **change your MongoDB password immediately**
3. ✅ Always use Vercel's Environment Variables for production secrets, never commit them