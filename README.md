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
- Register, log in, and log out with session-based auth
- Store hashed passwords
- Keep user-created movies tied to the logged-in user
- Store movie data in MariaDB
- Use a React frontend with a Flask backend

## Auth And Movie Ownership

Movie Bites uses Flask sessions for authentication. Users can register, log in, log out, and stay logged in across page refreshes while their session is active.

Passwords are hashed before they are saved to the database. Movies created by a logged-in user are saved with that user's `user_id`, and users can only edit or delete their own movies.

The seed movies have a `NULL` `user_id`, which makes them global demo entries visible to everyone. They are included to make the app feel populated for portfolio screenshots and testing. In a serious deployed version, those global entries would either be removed or handled as separate sample data.

## Running The Project Locally

Set the MariaDB connection environment variable before running the API:

Linux
```bash
export DATABASE_URL="mysql+mysqlconnector://YOUR_MARIADB_USER:YOUR_MARIADB_PASSWORD@localhost/movie_db"
```

Replace `YOUR_MARIADB_USER` and `YOUR_MARIADB_PASSWORD` with your own local MariaDB username and password.

Preload the MariaDB database from the backend folder:

Linux
```bash
cd movie-api
mariadb -u YOUR_MARIADB_USER -p movie_db < seed_movie_db.sql
```

When prompted, enter your MariaDB password.

The seed file creates the `movie_db` database tables if they do not already exist and inserts the starter movie data. 

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

## Notes

This is a learning project and is still in progress. 
