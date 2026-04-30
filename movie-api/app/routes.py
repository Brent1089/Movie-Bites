from flask import jsonify, request
from app import app, db
from app.models import Movie
import copy


@app.get("/movies")
def get_movies():
    # Fetch all records from movie table
    movies = Movie.query.all()
    # Convert SQLAlchemy objects into a dictionary
    return jsonify([movie.to_dict() for movie in movies])


@app.get("/movies/<int:id>")
def get_movie(id):
    movie = Movie.query.get(id)
    if movie:
        return jsonify(movie.to_dict())
    return jsonify([])


@app.post("/movies")
def create_movie():
    data = request.get_json(silent=True) or {}

    new_movie = Movie(**data)

    try:
        db.session.add(new_movie)
        db.session.commit()
        return jsonify({"status": "New Movie added.", "id": new_movie.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "Movie could not be added.", "error": str(e)})


@app.put("/movies/<int:id>")
def update_movie(id):
    movie = Movie.query.get(id)
    if not movie:
        return jsonify({"status": "movie not found."})

    data = request.get_json(silent=True) or {}

    for key, value in data.items():
        if hasattr(movie, key):
            setattr(movie, key, value)

    db.session.commit()
    return jsonify({"status": "movie updated."})

@app.delete("/movies/<int:id>")
def delete_movie(id):
    movie = Movie.query.get(id)
    if movie:
        db.session.delete(movie)
        db.session.commit()
        return jsonify({"status": "Movie deleted."})
    return jsonify({"status": "Movie not found."})


@app.delete("/movies")
def delete_all_movies():
    db.session.query(Movie).delete()
    db.session.commit()
    return jsonify({"status": "All movies deleted."})
