# 🖥️ MedSlip ATM — Hardware Implementation Guide

> **Build a physical ATM-style kiosk** for the MedSlip system using a Raspberry Pi, touchscreen, thermal printer, and custom enclosure.

---

## 📌 Table of Contents

1. [Hardware Overview](#-hardware-overview)
2. [Bill of Materials (Shopping List)](#-bill-of-materials-shopping-list)
3. [Option 1: Raspberry Pi Kiosk (Recommended)](#-option-1-raspberry-pi-kiosk-recommended)
4. [Option 2: Android Tablet Kiosk (Simpler)](#-option-2-android-tablet-kiosk-simpler)
5. [Option 3: Windows Mini PC (Alternative)](#-option-3-windows-mini-pc-alternative)
6. [Touchscreen Display Setup](#-touchscreen-display-setup)
7. [Thermal Printer Integration](#-thermal-printer-integration)
8. [Physical Keypad (Optional)](#-physical-keypad-optional)
9. [Custom Enclosure Design](#-custom-enclosure-design)
10. [Network Architecture](#-network-architecture)
11. [Power Management & Auto-Start](#-power-management--auto-start)
12. [Security & Tamper Protection](#-security--tamper-protection)
13. [Full Assembly Guide](#-full-assembly-guide)
14. [Testing the Physical Kiosk](#-testing-the-physical-kiosk)
15. [Maintenance Checklist](#-maintenance-checklist)

---

## 🔧 Hardware Overview

The MedSlip ATM Kiosk is a **physical self-service machine** that patients use to print their prescription slips. Here's what the complete hardware setup looks like:

```
┌─────────────────────────────────────────────┐
│               ATM KIOSK ENCLOSURE             │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │          TOUCHSCREEN DISPLAY         │    │ ← 10"–15" touch monitor
│  │         (Shows token entry +         │    │    mounted at eye level
│  │          prescription preview)       │    │
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │                                     │    │
│  │          THERMAL PRINTER             │    │ ← Epson TM-T20 / Star TSP143
│  │      (Prints 80mm receipt slips)     │    │    at waist level
│  │                                     │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │          COMPUTER MODULE             │    │ ← Raspberry Pi 4/5 inside
│  │   (Runs the kiosk web application)   │    │    the enclosure
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │   POWER SUPPLY + UPS (inside)       │    │ ← Keeps running during
│  │                                     │    │    power cuts
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### How the Physical Kiosk Works:

1. **Patient** walks up to the kiosk
2. **Touchscreen** shows the token entry page (from `kiosk/` app on port 5174)
3. Patient taps the **on-screen keypad** (or physical keypad) to enter their token
4. **Raspberry Pi** sends the token to the **backend server** for validation
5. If valid → **Touchscreen** shows the prescription preview
6. Patient taps **"Print Slip"** → **Thermal printer** prints the slip
7. Patient takes the printed slip to the doctor

---

## 🛒 Bill of Materials (Shopping List)

### Essential Components

| Item | Recommended Model | Estimated Price | Purpose |
|------|------------------|----------------|---------|
| **Single Board Computer** | Raspberry Pi 5 (4GB) **or** Raspberry Pi 4 (4GB) | ₹5,000–₹8,000 | Runs the kiosk app |
| **Touchscreen Display** | 10.1" HDMI Touch Monitor (e.g., Waveshare or Elecrow) | ₹6,000–₹12,000 | Patient interaction screen |
| **Thermal Printer** | Epson TM-T20II **or** Star TSP143IIIU **or** Epson TM-T88VII | ₹8,000–₹15,000 | Prints prescription slips |
| **Thermal Paper Rolls** | 80mm x 80m thermal paper (pack of 10) | ₹300–₹500 | Consumable paper |
| **MicroSD Card** | 32GB+ Class A2 (Samsung EVO Plus) | ₹500–₹800 | OS + app storage |
| **Power Supply** | Official Raspberry Pi 27W USB-C PD (Pi 5) or 15W (Pi 4) | ₹800–₹1,200 | Powers the Pi |
| **HDMI Cable** | Micro HDMI to HDMI (Pi 0) or Mini HDMI (Pi 4) | ₹200–₹400 | Connects Pi to display |
| **USB Cable** | USB-A to USB-B (printer cable) | ₹200 | Connects printer |

### Optional Components

| Item | Purpose | Estimated Price |
|------|---------|----------------|
| **UPS / Power Bank** | Keeps kiosk running during power cuts | ₹1,500–₹3,000 |
| **USB Numpad** | Physical number keypad for token entry | ₹500–₹1,000 |
| **GPIO Keypad (DIY)** | Custom hardware keypad wired to GPIO pins | ₹300–₹800 |
| **VESA Mount Kit** | Mount display to enclosure | ₹500–₹1,000 |
| **Cooling Fan** | Active cooling for Pi 4/5 in enclosed space | ₹400–₹800 |
| **WiFi Dongle** | If Pi doesn't have built-in WiFi (Pi Zero) | ₹500 |
| **Ethernet Cable** | More reliable than WiFi for hospital network | ₹200 |

### Enclosure Parts (DIY)

| Item | Estimated Price | Purpose |
|------|----------------|---------|
| MDF or Plywood Sheet (6mm–12mm) | ₹500–₹1,000 | Kiosk body |
| Acrylic Sheet (3mm) | ₹300–₹600 | Front panel / screen cover |
| Hinges + Screws + Bolts | ₹200–₹400 | Assembly |
| Spray Paint / Vinyl Wrap | ₹300–₹600 | Finishing |
| Rubber Feet | ₹100 | Anti-slip base |
| Cable Management Ties | ₹100 | Neat wire routing |

### Total Estimated Cost

| Setup Option | Estimated Total Cost (₹) |
|-------------|--------------------------|
| **Budget (Pi Zero 2W + small screen + basic printer)** | ₹10,000–₹15,000 |
| **Standard (Pi 4/5 + 10" touch + Epson printer)** | ₹18,000–₹30,000 |
| **Premium (Industrial PC + 15" touch + heavy-duty printer + UPS)** | ₹35,000–₹60,000 |

---

## 🥇 Option 1: Raspberry Pi Kiosk (Recommended)

This is the recommended approach — a dedicated Raspberry Pi running the kiosk web app in fullscreen mode.

### What You Need
- Raspberry Pi 4 (4GB) or Raspberry Pi 5 (4GB/8GB)
- 32GB+ microSD card
- Touchscreen display (HDMI + USB touch)
- Power supply for Pi

### Step 1: Install Raspberry Pi OS

```bash
# Download Raspberry Pi Imager from: https://www.raspberrypi.com/software/
# Use it to write Raspberry Pi OS Lite (64-bit) to microSD card

# Or use the full desktop version:
# Raspberry Pi OS with Desktop (64-bit)
```

**Before writing the OS, configure:**
1. Hostname: `medslip-kiosk`
2. Enable SSH
3. Set username/password: `pi` / (your password)
4. Configure WiFi (or use Ethernet for reliability)

### Step 2: Boot and Update

```bash
# SSH into the Pi
ssh pi@medslip-kiosk.local
# or find IP: ping medslip-kiosk.local

# Update the system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl nodejs npm chromium-browser unclutter xserver-xorg x11-xserver-utils
```

### Step 3: Install Node.js (v18+)

Raspberry Pi OS repository Node.js is often outdated. Install the latest:

```bash
# Add NodeSource repository for Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version   # Should show v18.x.x
npm --version
```

### Step 4: Clone and Build the Kiosk App

```bash
# Clone the repository
git clone https://github.com/Aqibabass/medslip-project.git
cd medslip-system/kiosk

# Install dependencies
npm install

# Build the production version
npm run build
```

### Step 5: Configure the Backend URL

```bash
# Edit the .env file
nano .env

# Make sure it points to your server:
# VITE_API_URL=http://192.168.1.100:5000/api
# Replace with your backend server's IP
```

> ⚠️ **Important:** For production, don't use `localhost` for the backend URL — the kiosk Pi is a different machine than the server.

### Step 6: Set Up Auto-Start Kiosk Mode

Create a script that runs the kiosk app and opens it in Chromium:

```bash
# Create a startup script
sudo nano /home/pi/start-kiosk.sh
```

Add this content:

```bash
#!/bin/bash
# MedSlip Kiosk Auto-Start Script

# Wait for network
sleep 10

# Start a simple HTTP server to serve the built kiosk app
cd /home/pi/medslip-system/kiosk
npx serve -s dist -l 5174 &

# Wait for server to start
sleep 5

# Hide mouse cursor
unclutter -idle 0 &

# Open Chrome in fullscreen kiosk mode
chromium-browser --kiosk \
  --no-sandbox \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --no-first-run \
  --check-for-update-interval=31536000 \
  http://localhost:5174
```

Make it executable:

```bash
chmod +x /home/pi/start-kiosk.sh
```

### Step 7: Auto-Start on Boot

```bash
# Create a systemd service
sudo nano /etc/systemd/system/medslip-kiosk.service
```

Add:

```ini
[Unit]
Description=MedSlip ATM Kiosk
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi
ExecStart=/home/pi/start-kiosk.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable medslip-kiosk.service
sudo systemctl start medslip-kiosk.service

# Check status
sudo systemctl status medslip-kiosk.service
```

### Step 8: Rotate Display (If Needed)

If your touchscreen is mounted in portrait orientation:

```bash
# For touchscreen rotation (if USB touch)
sudo nano /etc/udev/rules.d/99-touchscreen.rules
# Add: ENV{ID_INPUT_TOUCHSCREEN}=="1", ENV{WL_OUTPUT}="HDMI-A-1"

# For display rotation, edit config.txt
sudo nano /boot/config.txt

# Add one of these lines at the end:
display_rotate=1   # 90 degrees
# display_rotate=2  # 180 degrees
# display_rotate=3  # 270 degrees
```

---

## 📱 Option 2: Android Tablet Kiosk (Simpler)

If you don't want to build a full Raspberry Pi kiosk, an Android tablet is the easiest option.

### What You Need
- An Android tablet (10" or larger recommended)
- USB OTG cable (if connecting a printer)
- [Fully Kiosk Browser](https://www.fulllab.com/) app (free trial / ₹500 for full version)

### Setup Steps

**Step 1:** Install the kiosk browser app on the tablet

**Step 2:** Configure it to open `http://<your-server-ip>:5174` in fullscreen

**Step 3:** Set up the tablet settings:
```
Settings → Display → Screen timeout → Never sleep
Settings → Security → Install unknown apps → Enable for the kiosk browser
```

**Step 4:** For thermal printer connection:
- Some thermal printers support Bluetooth
- Or use a USB thermal printer with a USB OTG adapter
- The tablet's browser print dialog can use Android's print service

**Pros:**
- ✅ No soldering or Linux setup needed
- ✅ Touchscreen and computer in one device
- ✅ Very portable
- ✅ Lower power consumption

**Cons:**
- ❌ Limited printer connectivity
- ❌ Less control over auto-restart and boot behavior
- ❌ Not as durable for public use without a rugged case

---

## 💻 Option 3: Windows Mini PC (Alternative)

If your hospital already uses Windows, a small Windows mini PC works too.

### What You Need
- Windows Mini PC (e.g., Intel NUC, Beelink, HP EliteDesk Mini)
- Touchscreen monitor
- Thermal printer with Windows drivers

### Setup Steps

**Step 1:** Install Node.js from [nodejs.org](https://nodejs.org/)

**Step 2:** Clone the project and build the kiosk:

```cmd
cd C:\medslip-kiosk
git clone https://github.com/Aqibabass/medslip-project.git
cd medslip-system/kiosk
npm install
npm run build
```

**Step 3:** Create a batch file to start the kiosk:

```batch
@echo off
:: start-kiosk.bat
cd /d "C:\medslip-kiosk\medslip-system\kiosk"
start /min npx serve -s dist -l 5174
timeout /t 5
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:5174
```

**Step 4:** Add to startup:
- Press `Win + R`, type `shell:startup`
- Copy `start-kiosk.bat` into the Startup folder

**Step 5:** Install the thermal printer driver (from manufacturer's website)

---

## 🖥️ Touchscreen Display Setup

### Display Options Comparison

| Type | Pros | Cons | Best For |
|------|------|------|----------|
| **HDMI + USB Touch** | Standard, works with everything | Needs separate power | Raspberry Pi kiosks |
| **DSI Display** | Direct ribbon cable to Pi, single cable | Pi-specific, limited sizes | Compact Pi builds |
| **All-in-One Tablet** | Integrated, no wiring | Less customizable | Quick deployment |
| **Industrial Touch** | Rugged, bright, long lifespan | Expensive | High-traffic hospital |

### Recommended Displays

| Model | Size | Resolution | Touch Type | Price (₹) |
|-------|------|-----------|------------|-----------|
| Waveshare 10.1" HDMI LCD | 10.1" | 1280×800 | Capacitive 5-point | ~8,000 |
| Elecrow 10.1" HDMI LCD | 10.1" | 1280×800 | Capacitive | ~7,000 |
| Official Raspberry Pi 7" Touch | 7" | 1024×600 | Capacitive (DSI) | ~6,000 |
| Kuman 10.1" LCD Touch | 10.1" | 1920×1080 | Capacitive | ~10,000 |

### Mounting Tips
- Use **VESA mount** (75×75mm or 100×100mm) for attaching to enclosure
- Position the screen at **eye level** (about 130–150cm from floor)
- Angle the screen **slightly upward** (15–20 degrees) for better viewing
- Use **tempered glass screen protector** for public use

---

## 🖨️ Thermal Printer Integration

### Software Setup with node-thermal-printer

The `kiosk/` app uses **jsPDF** to generate PDFs and opens the browser's print dialog. For direct thermal printing (no browser dialog), use **node-thermal-printer**.

#### Step 1: Install the Library

In the `kiosk/` directory:

```bash
npm install node-thermal-printer
```

#### Step 2: Create a Printer Service File

```bash
nano src/utils/printer-service.js
```

```javascript
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');

// Configure your printer
const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,    // or PrinterTypes.STAR
  interface: 'usb',             // USB connection
  // Or for serial: interface: '/dev/ttyUSB0'
  // Or for network: interface: 'tcp://192.168.1.50:9100'
  characterSet: 'SLOVENIA',    // Supports UTF-8 characters
  removeSpecialCharacters: false,
  lineCharacter: '-',
  options: {
    timeout: 5000               // 5 second timeout
  }
});

export async function printSlip(slipData) {
  try {
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Printer not connected');
    }

    // Print the prescription slip
    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(2, 2);
    printer.println('MedSlip Hospital');
    printer.bold(false);
    printer.setTextSize(1, 1);
    printer.println('Automated Prescription Slip');
    printer.drawLine();

    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(2, 1);
    printer.println(slipData.tokenId);
    printer.bold(false);
    printer.setTextSize(1, 1);
    printer.drawLine();

    printer.alignLeft();
    printer.println(`Patient:      ${slipData.patientName}`);
    printer.println(`Age/Gender:   ${slipData.age} / ${slipData.gender}`);
    printer.println(`Department:   ${slipData.department}`);
    printer.println(`Doctor:       ${slipData.doctor}`);
    printer.println(`Phone:        ${slipData.phone}`);
    printer.drawLine();

    printer.alignCenter();
    printer.setTextSize(0, 0);
    printer.println(`Printed: ${new Date().toLocaleString()}`);
    printer.drawLine();
    printer.println('This is a computer-generated');
    printer.println('prescription slip');
    printer.newLine();
    printer.cut();
    printer.beep();

    await printer.execute();
    return { success: true };
  } catch (error) {
    console.error('Printing error:', error);
    return { success: false, error: error.message };
  }
}
```

#### Step 3: Replace PDF Generation with Direct Print

Modify `kiosk/src/utils/print.js` to call the printer service:

```javascript
import { printSlip } from './printer-service';

async function handlePrint(slipData) {
  // Try direct thermal printing first
  const result = await printSlip(slipData);

  if (!result.success) {
    // Fall back to PDF if printer is not available
    generatePDF(slipData);
  }
}
```

### Supported Thermal Printers

| Printer Model | Interface | Notes |
|--------------|-----------|-------|
| **Epson TM-T20II** | USB | Most common, reliable, ~₹10,000 |
| **Epson TM-T88VII** | USB/Ethernet | Faster, more durable, ~₹18,000 |
| **Star TSP143IIIU** | USB | Good budget option, ~₹8,000 |
| **Star SP700** | USB/Serial | Heavy-duty, ~₹15,000 |
| **POS-X EVO** | USB | Affordable, ~₹6,000 |
| **Generic USB Thermal** | USB | Works but less reliable, ~₹3,000 |

### Printer Connection Options

```
USB ──── Direct USB connection to Raspberry Pi
          ├── Most common
          ├── Plugs and plays (usually)
          └── Use 'lsusb' to verify connection

Serial ── RS-232 serial connection
           ├── For industrial/commercial printers
           ├── More reliable for long cable runs
           └── Needs USB-to-Serial adapter

Ethernet ─ Network-connected printer
           ├── Can be shared across multiple kiosks
           ├── More expensive printer
           └── Configure via printer's IP address

Bluetooth ─ Wireless connection
            ├── Limited range (~10m)
            ├── Good for tablet kiosks
            └── Battery concerns
```

### Testing Printer Connection

```bash
# List USB devices to check printer is detected
lsusb

# Should show something like:
# Bus 001 Device 003: ID 0416:5011 Winbond Electronics Corp. (Epson)

# Test the printer with node-thermal-printer example
cd /home/pi/medslip-system/kiosk
node -e "
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');
const p = new ThermalPrinter({ type: PrinterTypes.EPSON, interface: 'usb' });
p.println('MedSlip Test Print');
p.cut();
p.execute().then(() => console.log('Printed!'));
"
```

---

## 🔢 Physical Keypad (Optional)

If you want a physical keypad instead of (or in addition to) the on-screen touch keypad:

### Option A: USB Numpad (Plug-and-Play)

Connect a standard USB numeric keypad and modify the kiosk app to handle keyboard input:

In `kiosk/src/pages/ATM.jsx`, add keyboard event listener:

```javascript
// Add this to your component
useEffect(() => {
  const handleKeyPress = (e) => {
    const key = e.key.toUpperCase();
    
    // Digits 0-9
    if (/^[0-9]$/.test(key)) {
      appendToken(key);
    }
    // Letters A-F (for hex token characters)
    else if (/^[A-F]$/.test(key)) {
      appendToken(key);
    }
    // Dash
    else if (key === '-' || key === '_') {
      appendToken('-');
    }
    // Enter to submit
    else if (key === 'ENTER') {
      handleSubmit();
    }
    // Backspace to clear the last character
    else if (key === 'BACKSPACE' || key === 'DELETE') {
      removeLastChar();
    }
    // Escape to clear all
    else if (key === 'ESCAPE') {
      clearToken();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Option B: GPIO Keypad (DIY)

Wire a matrix keypad directly to the Raspberry Pi's GPIO pins:

**Wiring Diagram (4×4 Matrix Keypad):**

```
Keypad Pins → Raspberry Pi GPIO
Row 1 (Pin 1) → GPIO 17 (Pin 11)
Row 2 (Pin 2) → GPIO 27 (Pin 13)
Row 3 (Pin 3) → GPIO 22 (Pin 15)
Row 4 (Pin 4) → GPIO 23 (Pin 16)
Col 1 (Pin 5) → GPIO 24 (Pin 18)
Col 2 (Pin 6) → GPIO 25 (Pin 22)
Col 3 (Pin 7) → GPIO 5 (Pin 29)
Col 4 (Pin 8) → GPIO 6 (Pin 31)
```

**GPIO Keypad Python Service:**

Create `/home/pi/keypad-service.py`:

```python
#!/usr/bin/env python3
import RPi.GPIO as GPIO
import time
import requests
import json
import sys

# Keypad mapping (4×4 matrix)
MATRIX = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D']
]

# GPIO pin mapping
ROW_PINS = [17, 27, 22, 23]  # Row outputs
COL_PINS = [24, 25, 5, 6]    # Column inputs

# Backend API URL
API_URL = "http://192.168.1.100:5000/api/atm/validate"

# Token buffer
token = ""

GPIO.setmode(GPIO.BCM)

# Setup row pins as outputs
for pin in ROW_PINS:
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.HIGH)

# Setup column pins as inputs with pull-up
for pin in COL_PINS:
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def read_keypad():
    """Read the keypad and return the pressed key (or None)"""
    for row in range(4):
        GPIO.output(ROW_PINS[row], GPIO.LOW)
        
        for col in range(4):
            if GPIO.input(COL_PINS[col]) == GPIO.LOW:
                time.sleep(0.05)  # Debounce
                while GPIO.input(COL_PINS[col]) == GPIO.LOW:
                    pass  # Wait for release
                GPIO.output(ROW_PINS[row], GPIO.HIGH)
                return MATRIX[row][col]
        
        GPIO.output(ROW_PINS[row], GPIO.HIGH)
    
    return None

def validate_token(token_id):
    """Send token to backend for validation"""
    try:
        response = requests.post(API_URL, json={"tokenId": token_id})
        data = response.json()
        return data
    except Exception as e:
        return {"error": str(e)}

try:
    print("MedSlip Keypad Service Running...")
    print("Token format: MS-ATM-XXXXXXXX")
    
    while True:
        key = read_keypad()
        
        if key:
            if key == '*':  # Clear
                token = ""
                print("Cleared")
            elif key == '#':  # Submit
                if token:
                    print(f"Validating: {token}")
                    result = validate_token(token)
                    print(f"Result: {json.dumps(result)}")
                    token = ""  # Reset after submit
                else:
                    print("Empty token")
            else:
                token += key
                print(f"Token: {token}")
            
            time.sleep(0.1)

except KeyboardInterrupt:
    print("Shutting down...")
finally:
    GPIO.cleanup()
```

Run the service:

```bash
python3 /home/pi/keypad-service.py
```

---

## 📦 Custom Enclosure Design

### Home-Made Wooden Enclosure (Budget)

**Materials:**
- 1 sheet of 6mm MDF or plywood (2ft × 2ft) — ₹500
- 1 sheet of 3mm acrylic (for screen bezel) — ₹300
- 8× M4 screws + nuts — ₹100
- 4× rubber feet — ₹50
- Spray paint (matte white or hospital green) — ₹300

**Dimensions (Standard Kiosk):**

```
┌─────────────────────────────────┐
│          FRONT VIEW              │
│                                 │
│ ┌───────────────────────────┐   │
│ │                           │   │
│ │     TOUCHSCREEN           │   │ ← 250mm wide × 180mm tall
│ │     10.1" Display         │   │    (space for display)
│ │                           │   │
│ └───────────────────────────┘   │
│          (30mm gap)              │
│ ┌───────────────────────────┐   │
│ │                           │   │
│ │   THERMAL PRINTER SLOT    │   │ ← 200mm wide × 80mm tall
│ │   (Paper output slot)     │   │    (printer cutout)
│ │                           │   │
│ └───────────────────────────┘   │
│                                 │
│            400mm                 │
│          (total width)           │
└─────────────────────────────────┘
        │
        │ 500mm (total height)
        │
```

### 3D Printable Enclosure

If you have access to a 3D printer, here are the recommended design specs:

**Print Settings:**
- Filament: PETG (stronger than PLA, better for public use)
- Layer height: 0.2mm
- Infill: 30%
- Supports: Needed for overhangs

**STL Files to Create:**
```
kiosk-enclosure/
├── back-panel.stl           # Main back plate with Pi mounts
├── front-bezel.stl          # Screen frame/bezel
├── printer-mount.stl        # Thermal printer bracket
├── side-panels.stl          # Left and right walls
├── base-plate.stl           # Bottom plate with rubber feet slots
├── top-vent.stl             # Top ventilation grille
└── pi-mount-bracket.stl     # Raspberry Pi mounting clips
```

### Pre-Made Enclosure (Commercial)

If you don't want to DIY, buy a ready-made kiosk enclosure:

| Product | Approx Price (₹) | Notes |
|---------|------------------|-------|
| Tablet Kiosk Enclosure (Generic) | 3,000–5,000 | Holds a tablet, locks with key |
| Custom Metal Kiosk Cabinet | 15,000–30,000 | Professional, durable |
| Floor-standing Kiosk Stand | 20,000–40,000 | With built-in printer mount |

---

## 🌐 Network Architecture

### Hospital Deployment Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    HOSPITAL NETWORK                        │
│                                                           │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │  ATM KIOSK   │    │  ATM KIOSK   │    │  ATM KIOSK   │  │
│  │  (Floor 1)   │    │  (Floor 2)   │    │  (Floor 3)   │  │
│  │  10.0.0.21   │    │  10.0.0.22   │    │  10.0.0.23   │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │           │
│         └──────────────────┼──────────────────┘           │
│                            │                              │
│                    ┌───────┴────────┐                     │
│                    │  NETWORK SWITCH │                     │
│                    │  (Hospital LAN)  │                     │
│                    └───────┬────────┘                     │
│                            │                              │
│                    ┌───────┴────────┐                     │
│                    │  BACKEND SERVER │                     │
│                    │  10.0.0.10:5000 │                     │ ← Can be on-premise
│                    └────────────────┘                        or cloud
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │               MONGODB DATABASE                        │  │
│  │  (local 10.0.0.11:27017  OR  MongoDB Atlas cloud)    │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                 ↑
         ┌───────┴───────┐
         │  PATIENT PHONES │
         │  (Connect via    │
         │  hospital WiFi   │
         │  or mobile data) │
         └─────────────────┘
```

### Network Recommendations

| Component | Connection | Notes |
|-----------|-----------|-------|
| **ATM Kiosk → Backend** | Ethernet (preferred) or WiFi | Ethernet is more reliable for printing |
| **Patient Phones → Backend** | WiFi or 4G/5G | Patients use the app on their own devices |
| **Backend → Database** | Local network or internet | Use MongoDB Atlas for cloud setup |
| **Backend → Razorpay** | Internet | Required only during payment processing |

### Network Security

```bash
# Firewall rules (on backend server)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH (admin only)
sudo ufw allow 5000/tcp    # API (from kiosk + patient app)
sudo ufw allow 27017/tcp   # MongoDB (from backend only, not public)

# On Raspberry Pi kiosk
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH (for admin access)
# No incoming ports needed — kiosk only makes outbound requests
```

### Static IP Configuration

Set static IP for the kiosk to ensure it always connects to the right server:

```bash
# Edit dhcpcd.conf (Raspberry Pi)
sudo nano /etc/dhcpcd.conf

# At the end, add:
interface eth0
static ip_address=10.0.0.21/24
static routers=10.0.0.1
static domain_name_servers=8.8.8.8 8.8.4.4

# For WiFi:
# interface wlan0
# static ip_address=10.0.0.21/24
# static routers=10.0.0.1
# static domain_name_servers=8.8.8.8 8.8.4.4
```

---

## ⚡ Power Management & Auto-Start

### UPS / Power Backup

A power outage in the middle of printing can corrupt data. Use a UPS:

```bash
# Budget option: Power bank with pass-through charging
# Connect Pi + display to a 20,000mAh power bank
# Power bank stays charged from wall outlet
# When power fails, kiosk runs for 4-6 more hours

# Better option: Mini UPS for Raspberry Pi
# Products: UPS HAT for Pi (e.g., Waveshare UPS HAT)
# These plug directly onto the Pi's GPIO pins
# Provides clean shutdown on power failure
```

### Auto-Start on Boot (Raspberry Pi)

We set up the systemd service earlier. Verify it's working:

```bash
# Check if the kiosk starts automatically on boot
sudo systemctl is-enabled medslip-kiosk.service
# Should output: enabled

# Reboot to test
sudo reboot

# After reboot, check the service status
sudo systemctl status medslip-kiosk.service
# Should show: active (running)
```

### Auto-Restart on Crash

The systemd service already has `Restart=always`, but add a watchdog:

```bash
# Add to medslip-kiosk.service
WatchdogSec=30
Restart=always
RestartSec=10
```

### Graceful Shutdown Button

Add a physical shutdown button to the kiosk:

```python
#!/usr/bin/env python3
# /home/pi/shutdown-button.py
import RPi.GPIO as GPIO
import time
import os

SHUTDOWN_PIN = 3  # GPIO 3 (Pin 5) — this pin has a pull-up resistor

GPIO.setmode(GPIO.BCM)
GPIO.setup(SHUTDOWN_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def shutdown(channel):
    time.sleep(2)  # Debounce — hold for 2 seconds
    if GPIO.input(SHUTDOWN_PIN) == GPIO.LOW:
        os.system("sudo shutdown -h now")

GPIO.add_event_detect(SHUTDOWN_PIN, GPIO.FALLING, callback=shutdown, bouncetime=2000)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
```

Run as a service:

```bash
sudo nano /etc/systemd/system/shutdown-button.service

[Unit]
Description=Shutdown Button
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /home/pi/shutdown-button.py
Restart=always

[Install]
WantedBy=multi-user.target

sudo systemctl enable shutdown-button.service
sudo systemctl start shutdown-button.service
```

---

## 🔒 Security & Tamper Protection

### Physical Security Checklist

| Measure | Implementation | Priority |
|---------|---------------|----------|
| **Locking enclosure** | Key-lockable front panel | High |
| **Kensington lock slot** | Use on Pi case + display | High |
| **Tamper-evident stickers** | Place on screw holes | Medium |
| **Cable locks** | Secure kiosk to wall/furniture | High |
| **Hidden power switch** | Internal switch, not accessible | Medium |
| **Ventilation grille security** | Small grille holes (no hand access) | Medium |
| **Weighted base** | Heavy base prevents tipping | High (for floor units) |

### Software Security for Public Kiosk

**1. Disable Right-Click / Context Menu:**
```javascript
// In kiosk/src/App.jsx
document.addEventListener('contextmenu', (e) => e.preventDefault());
```

**2. Disable Keyboard Shortcuts (F11, Alt+F4, Ctrl+W):**
```javascript
// In kiosk/src/App.jsx
document.addEventListener('keydown', (e) => {
  // Prevent Alt+F4, Ctrl+W, F11, etc.
  if (
    e.altKey || 
    (e.ctrlKey && e.key === 'w') || 
    (e.ctrlKey && e.key === 'W') ||
    e.key === 'F11'
  ) {
    e.preventDefault();
  }
});
```

**3. Disable Dev Tools (in production build):**
```bash
# In kiosk/vite.config.js
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true  # Removes console.log() calls
    }
  }
}
```

**4. Auto-Clear Screen After Inactivity:**
```javascript
// In kiosk/src/App.jsx
const TIMEOUT_DURATION = 60000; // 60 seconds

useEffect(() => {
  let timeout;
  
  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      // Go back to token entry screen
      navigate('/');
    }, TIMEOUT_DURATION);
  };
  
  document.addEventListener('click', resetTimer);
  document.addEventListener('touchstart', resetTimer);
  resetTimer();
  
  return () => {
    document.removeEventListener('click', resetTimer);
    document.removeEventListener('touchstart', resetTimer);
    clearTimeout(timeout);
  };
}, []);
```

**5. Limit API Access to Kiosk IPs Only:**
```javascript
// In server/server.js (add IP whitelist middleware)
const ALLOWED_IPS = ['10.0.0.21', '10.0.0.22', '10.0.0.23'];

app.use('/api/atm', (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  
  // Only block /api/atm routes, not patient routes
  if (!ALLOWED_IPS.includes(clientIp) && process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
});
```

**6. Daily Reboot Schedule:**
```bash
# Add to crontab for nightly reboot at 3 AM
sudo crontab -e

# Add this line:
0 3 * * * /sbin/shutdown -r now

# Also clear browser cache on reboot:
# In /home/pi/start-kiosk.sh, add before starting Chromium:
rm -rf ~/.cache/chromium/*
rm -rf ~/.config/chromium/*
```

---

## 🔩 Full Assembly Guide

### Step-by-Step Physical Assembly

**Day 1: Build the Enclosure**

```
1. Cut MDF/plywood to dimensions:
   - Front panel: 400mm × 500mm
   - Back panel: 400mm × 500mm
   - Side panels (×2): 200mm × 500mm
   - Top panel: 400mm × 200mm
   - Bottom panel: 400mm × 200mm
   - Internal shelf: 400mm × 150mm (for Pi + UPS)

2. Cut out screen hole on front panel:
   - Size depending on your display
   - Use a jigsaw for clean cuts

3. Cut out printer slot:
   - 200mm wide × 80mm tall
   - Position about 30mm from bottom

4. Sand all edges smooth

5. Paint or vinyl wrap all panels
   - Hospital green (#00A86B) or white
   - 2-3 coats for best finish

6. Allow 24 hours for paint to dry
```

**Day 2: Electronics Assembly**

```
7. Mount touchscreen display:
   - Secure with VESA mount or brackets
   - Route HDMI and USB touch cables to the back

8. Mount thermal printer:
   - Slide printer into the cutout from behind
   - Secure with screws/brackets included with printer
   - Route USB cable to the Pi

9. Mount Raspberry Pi:
   - Attach to the internal shelf using standoffs
   - Connect: HDMI cable, USB touch cable, printer USB, power

10. Mount UPS (if using):
    - Place on the internal shelf next to Pi
    - Connect Pi power to UPS output
    - Connect UPS input to wall power

11. Cable management:
    - Use zip ties to bundle cables neatly
    - Route cables along the edges

12. Close the enclosure:
    - Attach back panel with hinges (one side)
    - Add a lock to the opposite side
    - Attach rubber feet to bottom
```

**Day 3: Software Setup**

```
13. Flash Raspberry Pi OS to microSD card
14. Insert card and boot Pi
15. SSH into Pi
16. Install Node.js + dependencies
17. Clone repository and build kiosk app
18. Configure .env with backend URL
19. Set up auto-start service
20. Connect printer and test
21. Final testing (see next section)
```

---

## 🧪 Testing the Physical Kiosk

### Pre-Deployment Checklist

Run through each test before putting the kiosk in service:

| Test | Expected Result | ✓ |
|------|----------------|--|
| **Power on** | Pi boots up, display turns on within 30 seconds | ☐ |
| **Auto-start** | Kiosk app loads automatically without manual login | ☐ |
| **Touchscreen** | All areas of screen respond to touch | ☐ |
| **Virtual keypad** | On-screen keys respond, characters appear in input | ☐ |
| **Token validation** | Valid token shows prescription preview | ☐ |
| **Error handling** | Invalid token shows error message with "Try Again" | ☐ |
| **Print button** | Thermal printer prints a readable slip | ☐ |
| **Printer paper** | Printer detects paper-out and shows error (if supported) | ☐ |
| **Network connection** | Kiosk can reach the backend server | ☐ |
| **Timeout** | Screen returns to token entry after 60 seconds idle | ☐ |
| **Reboot** | After reboot, everything starts automatically | ☐ |
| **Power cut** | UPS keeps kiosk running (or shuts down gracefully) | ☐ |
| **Security** | Cannot exit kiosk mode (Alt+F4, F11, right-click blocked) | ☐ |

### Quick Test Script

```bash
#!/bin/bash
# /home/pi/test-kiosk.sh
echo "=== MedSlip Kiosk Test === v1.0"

echo ""
echo "1. Network..."
ping -c 2 10.0.0.10 && echo "   ✅ Server reachable" || echo "   ❌ Server NOT reachable"

echo ""
echo "2. Web server..."
curl -s http://localhost:5174 > /dev/null && echo "   ✅ Kiosk app serving on :5174" || echo "   ❌ Kiosk app NOT running"

echo ""
echo "3. Printer..."
lsusb | grep -i "printer\|EPSON\|STAR\|POS" && echo "   ✅ Printer detected" || echo "   ❌ Printer NOT detected"

echo ""
echo "4. Services (systemd)..."
systemctl is-active medslip-kiosk.service && echo "   ✅ Kiosk service running" || echo "   ❌ Kiosk service NOT running"

echo ""
echo "5. Memory..."
free -h | grep "Mem:"

echo ""
echo "6. Disk..."
df -h | grep "/dev/root"

echo ""
echo "=== Test Complete ==="
```

---

## 📋 Maintenance Checklist

### Daily (by hospital staff)

- [ ] Check that the kiosk display is on and working
- [ ] Verify thermal paper has enough remaining (replace if < 20% left)
- [ ] Quickly test with a known-good token

### Weekly

- [ ] Clean touchscreen with a microfiber cloth
- [ ] Check printer for paper jams or debris
- [ ] Verify network connectivity (ping the backend server)
- [ ] Check the kiosk log for errors:
  ```bash
  journalctl -u medslip-kiosk.service --since "7 days ago" | grep -i "error\|fail"
  ```

### Monthly

- [ ] Reboot the kiosk
  ```bash
  sudo reboot
  ```
- [ ] Replace thermal paper roll if low
- [ ] Clean printer head with cleaning card or isopropyl alcohol
- [ ] Check all cable connections are tight
- [ ] Inspect enclosure for damage or tampering
- [ ] Run the test script: `bash /home/pi/test-kiosk.sh`

### Quarterly

- [ ] Update Raspberry Pi OS:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- [ ] Rebuild the kiosk app (if new version released):
  ```bash
  cd ~/medslip-system/kiosk
  git pull
  npm install
  npm run build
  ```
- [ ] Check microSD card health:
  ```bash
  sudo smartctl -a /dev/mmcblk0
  # Or check for errors in dmesg
  dmesg | grep -i "mmc\|sd card\|error"
  ```
- [ ] Backup configuration files:
  ```bash
  cp ~/medslip-system/kiosk/.env ~/backups/.env.backup
  ```

### Battery/UPS Check (quarterly)

```bash
# If using an I2C UPS HAT
sudo apt install i2c-tools
i2cdetect -y 1
# Check battery level (varies by UPS model)
cat /sys/class/power_supply/ups/capacity
```

---

## 💡 Quick Reference

### Common Commands

```bash
# SSH into the kiosk
ssh pi@10.0.0.21

# Check service status
sudo systemctl status medslip-kiosk.service

# View logs
journalctl -u medslip-kiosk.service -f

# Restart the kiosk
sudo systemctl restart medslip-kiosk.service

# Reboot
sudo reboot

# Shutdown
sudo shutdown -h now

# Update kiosk app
cd ~/medslip-system/kiosk
git pull
npm install
npm run build
sudo systemctl restart medslip-kiosk.service
```

### Pinout Reference (Raspberry Pi 4/5 GPIO)

```
                    ┌──────────────────────────┐
                    │  GPIO Pinout (BCM Mode)   │
                    ├──────────┬───────────────┤
                    │  3.3V  1 │ 2  5V          │
                    │  GPIO2  3 │ 4  5V          │ ← Shutdown button
                    │  GPIO3  5 │ 6  GND         │
                    │  GPIO4  7 │ 8  GPIO14      │
                    │  GND    9 │ 10 GPIO15      │
                    │  GPIO17 11 │ 12 GPIO18     │ ← Keypad Row 1
                    │  GPIO27 13 │ 14 GND        │ ← Keypad Row 2
                    │  GPIO22 15 │ 16 GPIO23     │ ← Keypad Row 3
                    │  3.3V  17 │ 18 GPIO24      │ ← Keypad Row 4
                    │  GPIO10 19 │ 20 GND        │
                    │  GPIO9  21 │ 22 GPIO25      │ ← Keypad Col 1
                    │  GPIO11 23 │ 24 GPIO8       │ ← Keypad Col 2
                    │  GND   25 │ 26 GPIO7       │
                    │  GPIO0  27 │ 28 GPIO1       │
                    │  GPIO5  29 │ 30 GND        │ ← Keypad Col 3
                    │  GPIO6  31 │ 32 GPIO12      │ ← Keypad Col 4
                    │  GPIO13 33 │ 34 GND         │
                    │  GPIO19 35 │ 36 GPIO16      │
                    │  GPIO26 37 │ 38 GPIO20      │
                    │  GND   39 │ 40 GPIO21      │
                    └──────────┴───────────────┘
```

---

> Built with ❤️ for hospital queue management. Questions? See the main [`README.md`](./README.md) or [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) for software setup.