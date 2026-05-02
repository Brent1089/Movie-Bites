from flask import jsonify, request, session
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import Movie, User

# ******** AUTH ROUTES ********
@app.post("/register")
def register():
    """Register a new user with a hashed password."""
    data = request.get_json(silent=True) or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({"error": "Username or email already exists"}), 409

    password_hash = generate_password_hash(password)

    new_user = User(
        username=username,
        email=email,
        password=password_hash
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id
        return jsonify({
            "status": "User Registered.",
            "user": new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "User could not be registered.",
            "details": str(e)
        }), 500


@app.post("/login")
def login():
    """Log in a user and store their id in the session."""
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password."}), 401

    session["user_id"] = user.id

    return jsonify({
        "status": "Login successful.",
        "user": user.to_dict()
    }), 200


@app.get("/me")
def get_current_user():
    """Return the current session user."""
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"user": None}), 401

    user = db.session.get(User, user_id)

    if not user:
        session.pop("user_id", None)
        return jsonify({"user": None}), 401

    return jsonify({
        "user": user.to_dict()
    }), 200


@app.post("/logout")
def logout():
    """Clear the current user session."""
    session.pop("user_id", None)

    return jsonify({
        "status": "Logout successful"
    }), 200

# ******** MOVIE ROUTES ********
@app.get("/movies")
def get_movies():
    """Return public movies plus the current user's movies."""
    user_id = session.get("user_id")

    if user_id:
        movies = Movie.query.filter(
            or_(
                Movie.user_id == user_id,
                Movie.user_id.is_(None)
            )
        ).all()
    else:
        movies = Movie.query.filter_by(user_id=None).all()

    return jsonify([movie.to_dict() for movie in movies])


@app.get("/movies/<int:id>")
def get_movie(id):
    """Fetch and return data for a specific public or user-owned movie."""
    user_id = session.get("user_id")
    movie = db.session.get(Movie, id)

    if not movie:
        return jsonify({"error": "Movie not found."}), 404

    if movie.user_id is not None and movie.user_id != user_id:
        return jsonify({"error": "You do not have access to this movie."}), 403

    return jsonify(movie.to_dict()), 200


@app.post("/movies")
def create_movie():
    """Create a movie owned by the current user."""
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "You must be logged in to add a movie."}), 401

    data = request.get_json(silent=True) or {}
    data["user_id"] = user_id

    new_movie = Movie(**data)

    try:
        db.session.add(new_movie)
        db.session.commit()
        return jsonify(new_movie.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "Movie could not be added.", "error": str(e)}), 500


@app.put("/movies/<int:id>")
def update_movie(id):
    """Update a movie owned by the current user."""
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "You must be logged in to update a movie."}), 401

    movie = db.session.get(Movie, id)

    if not movie:
        return jsonify({"error": "Movie not found."}), 404

    if movie.user_id != user_id:
        return jsonify({"error": "You can only update your own movies."}), 403

    data = request.get_json(silent=True) or {}

    for key, value in data.items():
        if key not in ["id", "user_id"] and hasattr(movie, key):
            setattr(movie, key, value)

    try:
        db.session.commit()
        return jsonify(movie.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Movie could not be updated.",
            "details": str(e)
        }), 500


@app.delete("/movies/<int:id>")
def delete_movie(id):
    """Delete a movie owned by the current user."""
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "You must be logged in to delete a movie."}), 401

    movie = db.session.get(Movie, id)

    if not movie:
        return jsonify({"error": "Movie not found."}), 404

    if movie.user_id != user_id:
        return jsonify({"error": "You can only delete your own movies."}), 403

    try:
        db.session.delete(movie)
        db.session.commit()
        return jsonify({"status": "Movie deleted.", "id": id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Movie could not be deleted.",
            "details": str(e)
        }), 500
