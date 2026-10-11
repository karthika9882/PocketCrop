<<<<<<< HEAD
# PocketCrop+ 2.0

A multilingual, AI-assisted farmer decision-support system, initially focused on Tamil Nadu, India.

## Technology
- Web: React, TypeScript, Vite, Tailwind CSS (Tailwind integration is the next UI setup stage)
- API: Python, FastAPI, Pydantic
- Database: PostgreSQL, SQLAlchemy
- Authentication: JWT access tokens and Argon2 password hashing
- Planned AI: scikit-learn crop suitability, TensorFlow/Keras plant disease classification, open-source LLM + RAG

## Current milestone
This starter implements:
- FastAPI health endpoint
- PostgreSQL connection through SQLAlchemy
- User registration and email/password login
- Password hashing and JWT access tokens
- A simple React UI for registering, logging in, and viewing a protected dashboard

AI features are intentionally not mocked as real predictions. They will be added and tested in later milestones.

## Requirements
- Python 3.11 or 3.12 recommended
- Node.js LTS
- PostgreSQL
- Git

## 1. Configure PostgreSQL
Create a database named `pocketcrop`.

Example using psql:
```sql
CREATE DATABASE pocketcrop;
```

## 2. Configure backend
Open PowerShell in the project root:
```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set `DATABASE_URL` to your PostgreSQL username/password/database. Example:
```env
DATABASE_URL=postgresql+psycopg://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/pocketcrop
JWT_SECRET_KEY=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
```
Do not commit `.env` or share your database password.

Start the backend:
```powershell
uvicorn app.main:app --reload
```
Open http://127.0.0.1:8000/docs

## 3. Configure frontend
Open a second PowerShell terminal at the project root:
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## 4. Test
1. Register with a name, email, and password.
2. Log in with the same email and password.
3. The dashboard should display the authenticated email.
4. API docs: http://127.0.0.1:8000/docs

## 5. Push to GitHub
Create a new empty GitHub repository named `PocketCrop-Plus-2.0`. Then, from the project root:
```powershell
git init
git add .
git status
git commit -m "Initial commit: PocketCrop+ 2.0 starter"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/PocketCrop-Plus-2.0.git
git push -u origin main
```
Replace `YOUR_GITHUB_USERNAME`. Confirm `.env` is not listed by `git status` before committing.

## Planned milestones
1. Database schema and authentication (this starter)
2. Farmer onboarding and multiple farm profiles
3. Crop suitability rules and evaluated ML model
4. Profit/loss estimator and scenario analysis
5. Image upload and supported plant disease model
6. Agricultural knowledge ingestion, retrieval, and multilingual LLM assistant
7. Weather integration, cultivation tracking, and alerts
8. Tests, deployment, and documentation
=======
# PocketCrop
PocketCrop+ 2.0 is a multilingual AI-powered farming support system built with React, FastAPI, and PostgreSQL. It aims to provide crop recommendations, plant disease detection, farm cost analysis, and agricultural guidance in English and Tamil.
>>>>>>> d978f7a87ab34762af919080eadf931243d48390
