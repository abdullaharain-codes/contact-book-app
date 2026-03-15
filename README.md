# 📒 Contact Book App

A full-stack **multi-user** contact management application built with **React** and **Flask**, featuring JWT authentication, a beautiful dark UI, group organization, favorites, profile pictures, and full mobile responsiveness.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Flask](https://img.shields.io/badge/Flask-2.3-000000?style=flat&logo=flask)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?style=flat&logo=tailwind-css)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?style=flat&logo=jsonwebtokens)

🌐 **Live Demo:** [contact-book-app-virid.vercel.app](https://contact-book-app-virid.vercel.app)

---

## ✨ Features

### 🔐 Authentication
- **User Registration** — create your own account
- **User Login** — secure JWT-based authentication
- **Private contact books** — each user only sees their own contacts
- **Auto logout** — token expiry handled automatically

### 📋 Contact Management
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
| Vite | latest | Build tool |
| TailwindCSS | 3 | Styling |
| React Router | 6 | Navigation |
| Axios | latest | HTTP client |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11+ | Runtime |
| Flask | 2.3 | Web framework |
| Flask-JWT-Extended | 4.6 | JWT Authentication |
| SQLAlchemy | 3.1 | ORM |
| Flask-Migrate | 4.0 | DB migrations |
| Marshmallow | 3.20 | Serialization |
| PyMySQL | 1.1 | MySQL driver |
| bcrypt | 4.1 | Password hashing |
| Pillow | 11.1 | Image processing |
| Gunicorn | 21.2 | Production server |

### Database
- **MySQL 8.0**

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway | Backend + MySQL hosting |

---

## 📁 Project Structure

```
contact-book-app/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py           # User model
│   │   │   └── contact.py        # Contact model
│   │   ├── routes/
│   │   │   ├── auth.py           # Auth endpoints (register/login)
│   │   │   └── contacts.py       # Contact REST API (JWT protected)
│   │   ├── schemas/
│   │   │   └── contact_schema.py # Marshmallow schemas
│   │   ├── utils/
│   │   │   └── helpers.py        # File upload helpers
│   │   ├── config.py             # App configuration
│   │   └── __init__.py           # App factory
│   ├── migrations/               # Alembic migrations
│   ├── uploads/                  # Profile picture storage
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── contactsApi.js    # Axios API layer with JWT interceptor
│   │   ├── components/
│   │   │   ├── contacts/         # ContactCard, ContactList, ContactModal
│   │   │   ├── layout/           # Sidebar, Navbar, PrivateRoute
│   │   │   └── ui/               # Button, Toast, Avatar, ConfirmDialog
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Auth state + JWT management
│   │   │   └── ContactContext.jsx
│   │   ├── hooks/
│   │   │   └── useContacts.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── Groups.jsx
│   │   └── utils/
│   │       └── helpers.js
│   ├── vercel.json
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

### 1. Clone the Repository

```bash
git clone https://github.com/abdullaharain-codes/contact-book-app.git
cd contact-book-app
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=contact_book
DB_USER=root
DB_PASSWORD=your_password_here
SECRET_KEY=your_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
FLASK_ENV=development
FLASK_APP=run.py
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
FRONTEND_URL=http://localhost:3000
```

```bash
mysql -u root -p -e "CREATE DATABASE contact_book CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
flask db upgrade
python run.py
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout |

### Contacts (🔒 JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts/` | Get all contacts |
| POST | `/api/contacts/` | Create contact |
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

## ☁️ Deployment

### Backend → Railway
- Root directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn run:app --bind 0.0.0.0:$PORT`
- Pre-deploy: `flask db upgrade`
- MySQL linked via `MYSQL_URL`

### Frontend → Vercel
- Framework: Vite
- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`

---

## 🔧 Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_NAME` | Database name |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `SECRET_KEY` | Flask secret key |
| `JWT_SECRET_KEY` | JWT signing key |
| `FLASK_ENV` | `development` or `production` |
| `FRONTEND_URL` | CORS allowed origin |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |

---

## 👨‍💻 Author

**Muhammad Abdullah**  
Full-stack portfolio project — React + Flask + MySQL + JWT Authentication.

- GitHub: [@abdullaharain-codes](https://github.com/abdullaharain-codes)
- Live: [contact-book-app-virid.vercel.app](https://contact-book-app-virid.vercel.app)

---

## 📄 License

MIT License — feel free to use this project for learning or as a portfolio piece.
