from flask import jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import Movie, User

# ******** AUTH ROUTES ********
@app.post("/register")
def register():
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
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"user": None}), 401

    user = User.query.get(user_id)

    if not user:
        session.pop("user_id", None)
        return jsonify({"user": None}), 401

    return jsonify({
        "user": user.to_dict()
    }), 200


@app.post("/logout")
def logout():
    session.pop("user_id", None)

    return jsonify({
        "status": "Logout successful"
    }), 200

# ******** MOVIE ROUTES ********
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
