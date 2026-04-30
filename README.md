# Movie Bites

Movie Bites is a beginner full-stack movie tracking project. It uses a React frontend, a Flask API backend, and a MariaDB database.

## How The Project Works

The frontend lives in `movie-bites/`. It is a Create React App project that displays pages such as Home, Movies, Add Movie, Contact, About, Login, and Register.

The backend lives in `movie-api/`. It is a Flask app that exposes API routes for movie data. The React app sends requests to the Flask API, and the Flask API reads from or writes to the MariaDB database.

The database setup is in `movie-api/seed_movie_db.sql`. That file creates the `movie_db` database, creates the movie and user tables, and inserts starter movie data.

## Main Features

- View a list of movies
- Add new movies
- Edit existing movies
- Delete movies
- Store movie data in MariaDB
- Use a React frontend with a Flask backend

## Current Auth Status

User authentication is not fully implemented yet.

The project currently has Login and Register pages in the React app, and there is a `User` model in the Flask backend. However, the full authentication flow is still unfinished. At the moment, the app should not be treated as having secure, production-ready login behavior.

Planned auth work includes:

- Backend login and registration routes
- Password hashing
- Session or token handling
- Protected routes for logged-in users
- Separate movie views or movie data for different users

## Running The Project Locally

Start the Flask API from the backend folder:

Linux
```bash
cd movie-api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask run
```

Start the React app from the frontend folder:

Linux
```bash
cd movie-bites
npm i
npm start
```

The React app expects the Flask API to be available locally.

## Notes

This is a learning project and is still in progress. 
