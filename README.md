# 🥗 NutriScan – AI Powered Food Scanner

An AI-powered full-stack web application that scans food product ingredients and provides intelligent health insights using OpenAI API.

---

## 📌 Project Overview

NutriScan is designed to help users make informed food choices by analyzing ingredient lists and detecting potential health risks.  
The system extracts ingredients, identifies allergens, and provides AI-based recommendations including age-based suitability and health impact analysis.

This project was developed as a Final Year Engineering Project.

---

## 🚀 Key Features

- ✅ Ingredient extraction from product labels
- ✅ Allergen detection system
- ✅ Age-based food suitability analysis
- ✅ AI-powered health risk analysis using OpenAI API
- ✅ Expiry monitoring logic
- ✅ SQL-based structured data storage
- ✅ Full-stack architecture (Frontend + Backend + Database)

---

## 🏗️ Project Structure
Nutriscan/
│
├── MyNativeApp/              # React Native frontend
│   ├── assets/               # images, icons, static assets
│   ├── contexts/             # React Context files for global state
│   │   └── RegistrationContext.js
│   ├── navigation/           # app navigation setup
│   │   └── AppNavigation.js
│   ├── screens/              # all UI screens
│   │   ├── AgeGenderScreen.js
│   │   ├── CameraScan.js
│   │   ├── GalleryScan.js
│   │   ├── HealthProfileScreen.js
│   │   ├── HomeScreen.js
│   │   ├── Login.js
│   │   ├── NotificationScreen.js
│   │   ├── Onboarding1.js
│   │   ├── Onboarding2.js
│   │   ├── ScanAnalysis.js
│   │   ├── ScanDetails.js
│   │   ├── ScanHistory.js
│   │   └── Signup.js
│   ├── services/              # API helper or shared services
│   │   └── api.js
│   ├── .gitignore
│   ├── app.json
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json / yarn.lock
│   └── other config files
│
├── nutriscan-backend/        # Node.js + Express backend
│   ├── config/               # configuration files (e.g., DB config)
│   ├── controllers/          # request handlers / business logic
│   │   ├── authController.js
│   │   ├── notificationController.js
│   │   ├── scanController.js
│   │   └── ...
│   ├── database/             # database-related files
│   │   └── schema.sql
│   ├── middleware/           # Express middleware (auth, validation, etc.)
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── ...
│   ├── models/               # DB models or schemas
│   │   ├── Scan.js
│   │   ├── User.js
│   │   └── ...
│   ├── routes/               # API endpoint definitions
│   │   ├── auth.js
│   │   ├── notification.js
│   │   ├── scan.js
│   │   └── ...
│   ├── services/             # reusable service logic
│   │   └── expiryCheckService.js
│   ├── utils/                # utility functions or helpers
│   ├── .env                  # environment variables (not committed)
│   ├── .gitignore            # ignore node_modules, env files, etc.
│   ├── package.json
│   └── server.js             # entry point to start the backend
│
└── README.md                 # project overview, instructions, etc.

## 🌍 Future Enhancements

- 📱 Mobile Application Version
- 📊 Nutritional Score System
- 📷 Barcode Scanner Integration
- ☁️ Cloud Deployment
- 👩 Women-Centric Health Insights Dashboard

## 👩‍💻 Author

Navneetha Reddy  
Bengaluru, India  
LinkedIn: www.linkedin.com/in/navneetha-reddy-b0a589284  

---

## 📄 License

This project is developed for academic and learning purposes.
