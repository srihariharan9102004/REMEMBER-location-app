# 📍 REMEMBER – Location Based Reminder App

<p align="center">
  <img src="./public/rememberlogo.jpg" alt="Remember Logo" width="180">
</p>

<p align="center">
  <b>Never forget your tasks based on where you are.</b>
</p>

---

## 🚀 Overview

**REMEMBER** is a smart Location-Based Reminder web application that alerts users when they reach a selected destination.

Instead of remembering tasks yourself, simply choose a destination, write a reminder, and let the application notify you automatically when you arrive.

The application uses **Live GPS Tracking**, **Interactive Maps**, **Route Navigation**, **Alarm Sound**, and **Custom Reminder Messages** to provide a seamless location reminder experience.

---

# ✨ Features

✅ Live GPS Location Tracking

✅ Search Current Location or Enter Manually

✅ Search Destination by Place Name

✅ Select Destination by Clicking on Map

✅ Automatic Route Generation

✅ Adjustable Reminder Radius (50m – 1000m)

✅ Real-Time Distance Calculation

✅ Reminder Message Support

✅ Custom Alarm Notification

✅ Mobile Responsive UI

✅ Interactive Map with Zoom Support

✅ Automatic Route Zoom

✅ Destination Arrival Popup

---

# 📷 Screenshots

## Desktop

> Add your desktop screenshot here

```
/screenshots/desktop.png
```

---

## Mobile

> Add your mobile screenshot here

```
/screenshots/mobile.png
```

---

# 🛠 Tech Stack

### Frontend

- React.js
- JavaScript (ES6)
- HTML5
- CSS3
- Bootstrap

### Maps

- React Leaflet
- Leaflet.js
- OpenStreetMap

### APIs

- Browser Geolocation API
- Nominatim Geocoding API
- Nominatim Reverse Geocoding API
- OSRM Routing API

---

# 📦 Libraries Used

| Library | Purpose |
|----------|----------|
| react | Frontend Framework |
| react-dom | React Rendering |
| react-leaflet | Interactive Maps |
| leaflet | Map Rendering |
| bootstrap | Responsive UI |

---

# 🌐 APIs Used

## 📍 Geolocation API

Used to obtain the user's live GPS location.

```
navigator.geolocation.watchPosition()
```

---

## 🗺 Nominatim Search API

Convert location names into coordinates.

Example:

```
https://nominatim.openstreetmap.org/search
```

---

## 📍 Reverse Geocoding API

Convert GPS coordinates into readable addresses.

Example:

```
https://nominatim.openstreetmap.org/reverse
```

---

## 🚗 OSRM Routing API

Generates the driving route between source and destination.

Example:

```
https://router.project-osrm.org/
```

---

# 📂 Project Structure

```
Remember-App
│
├── public
│   ├── alarm.mp3
│   ├── rememberlogo.jpg
│
├── src
│   ├── components
│   │      ├── MapView
│   │      ├── MapView.jsx
│   │      ├── MapView.css
│   │
│   ├── utils
│   │      └── distance.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/srihariharan9102004/REMEMBER-location-app.git
```

Go into the project

```bash
cd REMEMBER-location-app
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

---

# 🚀 Future Enhancements

- 🔔 Custom Alarm Tone Upload
- 🎵 Multiple Notification Sounds
- 🌙 Dark Mode
- ☁ Cloud Reminder Storage
- 🔐 User Authentication
- 📱 Progressive Web App (PWA)
- 📌 Multiple Destination Reminders
- 📍 Voice Reminder Support

---

# 💡 How It Works

1. Detect your live location.
2. Enter or select a destination.
3. Set the reminder radius.
4. Write your reminder.
5. Start traveling.
6. When you enter the selected radius:
   - Alarm starts 🔔
   - Reminder popup appears 📍
   - Vibration begins (supported devices)

---

# 📈 Highlights

- Responsive Design
- Real-Time GPS Tracking
- Dynamic Route Navigation
- Interactive Maps
- Modern UI
- Mobile Friendly
- Lightweight Application

---

# 👨‍💻 Author

## Srihariharan R

**Full Stack Developer | Java Developer | React Developer | AI Enthusiast**

GitHub:
https://github.com/srihariharan9102004

LinkedIn:
https://www.linkedin.com/in/srihariharan-r

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.

---

## 📜 License

This project is licensed under the MIT License.