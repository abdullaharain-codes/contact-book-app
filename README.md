# 📒 Contact Book App

A full-stack contact management application built with **React** and **Flask**, featuring a beautiful dark UI, group organization, favorites, profile pictures, and full mobile responsiveness.

![Contact Book](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Flask](https://img.shields.io/badge/Flask-2.3-000000?style=flat&logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat&logo=tailwind-css)

---

## ✨ Features

- ➕ **Add / Edit / Delete** contacts with full form validation
- 🔍 **Real-time search** across name, email, phone, company
- ❤️ **Favorites** — mark and manage favorite contacts
- 👥 **Groups** — organize contacts into Family, Friends, Work, Other
- 🖼️ **Profile pictures** — upload and display contact photos
- 📱 **Fully responsive** — mobile-first design with slide-in sidebar
- 🌙 **Dark theme** throughout
- 🗑️ **Styled confirm dialogs** — no browser popups
- 📊 **Dashboard stats** — total contacts, favorites, groups, weekly additions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 8 | Build tool |
| TailwindCSS | 3 | Styling |
| React Router | 6 | Navigation |
| Axios | latest | HTTP client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Runtime |
| Flask | 2.3 | Web framework |
| SQLAlchemy | 3.1 | ORM |
| Flask-Migrate | 4.0 | DB migrations |
| Marshmallow | 3.20 | Serialization |
| PyMySQL | 1.1 | MySQL driver |
| Pillow | 11.1 | Image processing |

### Database
- **MySQL 8.0**

---

## 📁 Project Structure

```
contact-book-app/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── contact.py        # Contact model
│   │   ├── routes/
│   │   │   └── contacts.py       # REST API endpoints
│   │   ├── schemas/
│   │   │   └── contact_schema.py # Marshmallow schemas
│   │   ├── utils/
│   │   │   └── helpers.py        # File upload helpers
│   │   ├── config.py             # App configuration
│   │   └── __init__.py           # App factory
│   ├── migrations/               # Alembic migrations
│   ├── uploads/                  # Profile picture storage
│   ├── .env                      # Environment variables
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── contactsApi.js    # Axios API layer
│   │   ├── components/
│   │   │   ├── contacts/         # ContactCard, ContactList, ContactModal
│   │   │   ├── layout/           # Sidebar, Navbar
│   │   │   └── ui/               # Button, Toast, Avatar, ConfirmDialog
│   │   ├── context/
│   │   │   └── ContactContext.jsx
│   │   ├── hooks/
│   │   │   └── useContacts.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── Groups.jsx
│   │   └── utils/
│   │       └── helpers.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/contact-book-app.git
cd contact-book-app
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create your `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=contact_book
DB_USER=root
DB_PASSWORD=your_password_here
SECRET_KEY=your_secret_key_here
FLASK_ENV=development
FLASK_APP=run.py
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
FRONTEND_URL=http://localhost:3000
```

Set up the database:

```bash
# Create database in MySQL
mysql -u root -p -e "CREATE DATABASE contact_book CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
flask db upgrade

# Start backend
python run.py
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
# Start frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts/` | Get all contacts (paginated) |
| POST | `/api/contacts/` | Create new contact |
| GET | `/api/contacts/:id` | Get single contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |
| PATCH | `/api/contacts/:id/favorite` | Toggle favorite |
| GET | `/api/contacts/search?q=` | Search contacts |
| GET | `/api/contacts/favorites` | Get favorites |
| GET | `/api/contacts/groups/:name` | Get by group |
| GET | `/api/contacts/stats` | Get statistics |
| GET | `/api/health` | Health check |

---

## 📸 Screenshots

> Dashboard — All contacts with stats
> 
> Groups — Organized contact groups
> 
> Mobile — Responsive slide-in sidebar

---

## 🔧 Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | Database name | `contact_book` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `SECRET_KEY` | Flask secret key | `your-secret-key` |
| `FLASK_ENV` | Environment | `development` |
| `UPLOAD_FOLDER` | Upload directory | `uploads` |
| `FRONTEND_URL` | CORS origin | `http://localhost:3000` |

### Frontend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📝 .gitignore

Make sure your `.gitignore` includes:

```
# Backend
backend/venv/
backend/.env
backend/uploads/*
!backend/uploads/.gitkeep
backend/__pycache__/
backend/**/__pycache__/
*.pyc

# Frontend
frontend/node_modules/
frontend/.env
frontend/dist/

# General
.DS_Store
*.log
```

---

## 👨‍💻 Author

Built as a portfolio project demonstrating full-stack development with React + Flask + MySQL.

---

## 📄 License

MIT License — feel free to use this project for learning or as a portfolio piece.