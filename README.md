# 🌿 Suneth Latex (Pvt) Ltd – Latex Business Management System

A full-stack **Latex Purchase & Sales Management System** built with  
**React + Vite (frontend)** and **Node.js + Express + MongoDB (backend)**.  
It helps latex businesses record purchases, monitor stock, handle bowser profits, manage daily cash, generate PDF receipts, and control everything through **AI Voice Assistant,🤖 Ask AI about Reports,🔮 Profit Forecast Assistant**.

--------------------------------------------------------------------------------------------------------------

## 🚀 Features Overview

### 🧾 Transactions & Purchases
- Record latex purchases from sellers (liters, density, rate, total).
- Auto‑calculate weight (kg) using dynamic density maps.
- Generate **PDF receipts** instantly.
- Update payment status (Paid / Not Paid).
- Filter and view recent transactions.
- AI Voice Assistant

### 💰 Cash Management
- Track daily bank withdrawals and payouts to sellers.
- Auto‑calculate remaining or borrowed funds for the day.
- Summarized financial report by date.

### 📊 Reporting
- Generate reports for any date range.
- Summarize total liters, kilograms, amounts, and paid totals.
- AI report query endpoint → ask natural‑language questions like  
  “Show total liters last month” or “How much did we pay to sellers this year?”
- Ask AI about Reports feature

### 🹩 Profit Tracking (Bowser Sales)
- Calculate and visualize profit per sale using beautiful Recharts.
- Pie chart for profit breakdown and line chart for profit history.
- Stock Marker feature: mark current stock as sold to reset profit tracking.
- Profit Forecast Assistant

### 🎙️ AI Voice Assistant
- Use voice commands to record a new purchase.
- “Buy 500 liters from Sunil at density 120 for 340 rupees” → automatically parsed and saved.
- Powered by the **OpenAI GPT‑4o‑mini** model for lightweight intelligent parsing.

### 🔒 Authentication System
- Secure register & login with JWT tokens.
- Protected routes for all business data.
- Token auto‑attached to every API request.

--------------------------------------------------------------------------------------------------------------

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, Axios, Recharts |
| **Backend** | Node.js, Express 5, MongoDB (Mongoose), JWT, PDFKit |
| **AI Integration** | OpenAI GPT‑4o‑mini via `openai` SDK |
| **Authentication** | JWT + bcrypt hashing |
| **Dev Tools** | Vite, Nodemon, ESLint |

--------------------------------------------------------------------------------------------------------------

## 🗂️ Project Structure

New folder/
│
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # UI components (forms, charts, tables, etc.)
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Login, Register, Bowser, Reports pages
│   │   ├── utils/axios.js
│   │   └── App.jsx / main.jsx
│   └── package.json
│
└── server/               # Express backend
    ├── routes/           # All REST endpoints (+ AI routes)
    ├── models/           # MongoDB models
    ├── data/densityMap.js
    ├── server.js         # Start‑up file
    └── package.json

--------------------------------------------------------------------------------------------------------------

## ⚙️ Installation & Setup

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/en) (v18+)
- [MongoDB Atlas](https://www.mongodb.com/atlas) or local MongoDB
- An [OpenAI API Key](https://platform.openai.com/account/api-keys)

--------------------------------------------------------------------------------------------------------------

### 2️⃣ Clone the repository
bash

git clone https://github.com/<your-username>/latex-system.git
cd "New folder"


--------------------------------------------------------------------------------------------------------------

### 3️⃣ Backend Setup
bash
cd server
npm install

Create a `.env` file inside `/server`:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key


Then start the backend:
bash
npm start


If all goes well:

✅ Mongo connected
🚀 Server running on port 5000


--------------------------------------------------------------------------------------------------------------

### 4️⃣ Frontend Setup
bash
cd ../client
npm install
npm run dev


The frontend will usually run at:

http://localhost:5173

--------------------------------------------------------------------------------------------------------------


## 🧠 AI Endpoints Summary

| Endpoint | Purpose |
|-----------|----------|
| `POST /api/ai/parsePurchase` | Parse voice/text input into purchase data |
| `POST /api/ai/report/query` | Natural language reporting queries |
| `POST /api/ai/profit/forecast` | Predict profits on hypothetical sale |
| `GET  /api/ai/profit/insights` | Summarized trends in past profits |

*(Protected with JWT authentication where applicable.)*

--------------------------------------------------------------------------------------------------------------

## 📈 Example Workflows

### Record a new purchase
1. **Login → Dashboard → Purchase Form**
2. Fill Seller, Liters, Density, Rate.
3. Click **“Save & Generate Bill”** → Auto PDF receipt.

### Manage daily cash
1. Go to **Cash** page.
2. Enter amount brought from bank.
3. System auto‑fills seller payouts and calculates balance or borrowed amount.

### Check profit trends
- Go to **Profit (Bowser)** page.
- View auto‑calculated pie and line charts for the latest profit margins.

### Voice automation
- Tap 🎤 mic (bottom‑right) and say:
  > “Buy 800 liters from Saman at 120 density for 340”
- The AI extracts all values and saves the purchase.

--------------------------------------------------------------------------------------------------------------

## 🖨️ PDF Receipt Preview

Each transaction generates a small portable receipt (7 cm × 10 cm) via **PDFKit**.  
It includes date, seller, liters, density, kilograms, rate, total, and status.

--------------------------------------------------------------------------------------------------------------

## 🤖 Security Notes

- All important routes are protected with JWT middleware (`/middleware/auth.js`).
- Passwords are hashed using bcrypt.
- Tokens stored locally and auto‑attached to Axios requests.
- Never commit `.env` or real API keys to source control.

--------------------------------------------------------------------------------------------------------------

## 🧪 Possible Future Improvements

- Add seller analytics (leaderboard by total liters).
- SMS alerts via Twilio for completed payments.
- Expense tracking (bowser diesel, maintenance).
- Multi‑user roles (manager vs cashier).
- Deploy to cloud (Render / Vercel / Atlas + Netlify).

--------------------------------------------------------------------------------------------------------------

## 🧑‍💻 Developer Shortcuts

| Command | Description |
|----------|-------------|
| `npm run dev` (client) | Start frontend (Vite) |
| `npm start` (server) | Start backend with hot‑reload (nodemon) |
| `npm run build`         | Build production frontend |
| `vite preview`          | Serve built frontend locally |

--------------------------------------------------------------------------------------------------------------

## ❤️ Credits

Built with creativity by  
**Suneth Latex (Pvt) Ltd** × **Modern Full‑Stack JavaScript Stack**

> “Clean business data, happy latex traders, and just a pinch of AI magic.”

--------------------------------------------------------------------------------------------------------------
