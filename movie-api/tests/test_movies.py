from app import db
from app.models import Movie, User


def test_get_movies_returns_public_movie_for_logged_out_user(client):
    other_user = User(
        username="otheruser",
        email="other@example.com",
        password="hashed-password",
    )

    db.session.add(other_user)
    db.session.commit()

    public_movie = Movie(
        title="Alien",
        year="1979",
        genre="horror",
        user_id=None,
    )

    private_movie = Movie(
        title="My Private Movie",
        year="2024",
        genre="drama",
        user_id=other_user.id,
    )

    db.session.add_all([public_movie, private_movie])
    db.session.commit()

    response = client.get("/movies")

    assert response.status_code == 200

    data = response.get_json()
    titles = [movie["title"] for movie in data]

    assert "Alien" in titles
    assert "My Private Movie" not in titles


def test_get_movies_returns_private_movie_for_logged_in_user(client):
    user = User(
        username="otheruser",
        email="other@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    private_movie = Movie(
        title="My Private Movie",
        year="2024",
        genre="drama",
        user_id=user.id,
    )

    db.session.add(private_movie)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.get("/movies")

    assert response.status_code == 200

    data = response.get_json()
    titles = [movie["title"] for movie in data]

    assert "My Private Movie" in titles


def test_create_movie_adds_movie_for_logged_in_user(client):
    user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.post(
        "/movies",
        json={
            "title": "Blade",
            "year": "1996",
            "genre": "sci-fi",
            "age_rating": "R",
            "description": "The man known as Blade hunts vampires.",
            "poster_url": "https://example.com/blade-runner.jpg",
            "star_rating": "5",
            "comment": "Moody and action packed.",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["title"] == "Blade"
    assert data["user_id"] == user.id

    movie = Movie.query.filter_by(title="Blade").first()

    assert movie is not None
    assert movie.title == "Blade"
    assert movie.year == "1996"
    assert movie.user_id == user.id

def test_edit_movie_for_logged_in_user(client):
    user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.post(
        "/movies",
        json={
            "title": "Blade",
            "year": "1996",
            "genre": "sci-fi",
            "age_rating": "R",
            "description": "The man known as Blade hunts vampires.",
            "poster_url": "https://example.com/blade.jpg",
            "star_rating": "5",
            "comment": "Moody and action packed.",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["title"] == "Blade"
    assert data["user_id"] == user.id

    movie_id = data["id"]

    response = client.put(
        f"/movies/{movie_id}",
        json={
            "title": "Blade 2",
            "year": "1997",
            "genre": "sci-fi",
            "age_rating": "R",
            "description": "The man known as Blade hunts vampires again.",
            "poster_url": "https://example.com/blade-2.jpg",
            "star_rating": "4",
            "comment": "Still action packed.",
        },
    )

    assert response.status_code == 200

    movie = db.session.get(Movie, movie_id)

    assert movie is not None
    assert movie.title == "Blade 2"
    assert movie.year == "1997"
    assert movie.genre == "sci-fi"
    assert movie.user_id == user.id

def test_edit_movie_rejects_movie_owned_by_different_user(client):
    owner = User(
        username="owner",
        email="owner@example.com",
        password="hashed-password",
    )

    other_user = User(
        username="otheruser",
        email="other@example.com",
        password="hashed-password",
    )

    db.session.add_all([owner, other_user])
    db.session.commit()

    movie = Movie(
        title="Blade",
        year="1996",
        genre="sci-fi",
        age_rating="R",
        description="The man known as Blade hunts vampires.",
        poster_url="https://example.com/blade.jpg",
        star_rating="5",
        comment="Moody and action packed.",
        user_id=owner.id,
    )

    db.session.add(movie)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = other_user.id

    response = client.put(
        f"/movies/{movie.id}",
        json={
            "title": "Blade 2",
            "year": "1997",
            "genre": "sci-fi",
            "age_rating": "R",
            "description": "The man known as Blade hunts vampires again.",
            "poster_url": "https://example.com/blade-2.jpg",
            "star_rating": "4",
            "comment": "Still action packed.",
        },
    )

    assert response.status_code == 403
    assert response.get_json()["error"] == "You can only update your own movies."

    movie_after_update_attempt = db.session.get(Movie, movie.id)

    assert movie_after_update_attempt is not None
    assert movie_after_update_attempt.title == "Blade"
    assert movie_after_update_attempt.year == "1996"
    assert movie_after_update_attempt.genre == "sci-fi"
    assert movie_after_update_attempt.user_id == owner.id


def test_delete_movie_for_logged_in_user(client):
    user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.post(
        "/movies",
        json={
            "title": "Blade",
            "year": "1996",
            "genre": "sci-fi",
            "age_rating": "R",
            "description": "The man known as Blade hunts vampires.",
            "poster_url": "https://example.com/blade.jpg",
            "star_rating": "5",
            "comment": "Moody and action packed.",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["title"] == "Blade"
    assert data["user_id"] == user.id

    movie_id = data["id"]

    response = client.delete(f"/movies/{movie_id}")

    assert response.status_code == 200

    movie = db.session.get(Movie, movie_id)

    assert movie is None

def test_delete_movie_rejects_movie_owned_by_different_user(client):
    owner = User(
        username="owner",
        email="owner@example.com",
        password="hashed-password",
    )

    other_user = User(
        username="otheruser",
        email="other@example.com",
        password="hashed-password",
    )

    db.session.add_all([owner, other_user])
    db.session.commit()

    movie = Movie(
        title="Blade",
        year="1996",
        genre="sci-fi",
        user_id=owner.id,
    )

    db.session.add(movie)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = other_user.id

    response = client.delete(f"/movies/{movie.id}")

    assert response.status_code == 403
    assert response.get_json()["error"] == "You can only delete your own movies."

    movie_after_delete_attempt = db.session.get(Movie, movie.id)

    assert movie_after_delete_attempt is not None
    assert movie_after_delete_attempt.user_id == owner.id
    assert movie_after_delete_attempt.title == "Blade"
