from werkzeug.security import check_password_hash

from app import db
from app.models import User


def test_register_creates_user_with_hashed_password_and_session(client):
    response = client.post(
        "/register",
        json={
            "username": "tester",
            "email": "test@example.com",
            "password": "super-secret",
        },
    )

    assert response.status_code == 201

    data = response.get_json()

    assert data["status"] == "User Registered."
    assert data["user"] == {
        "id": data["user"]["id"],
        "username": "tester",
        "email": "test@example.com",
    }
    assert "password" not in data["user"]

    user = User.query.filter_by(email="test@example.com").first()

    assert user is not None
    assert user.username == "tester"
    assert user.password != "super-secret"
    assert check_password_hash(user.password, "super-secret")

    with client.session_transaction() as session:
        assert session["user_id"] == user.id


def test_register_rejects_missing_required_fields(client):
    response = client.post(
        "/register",
        json={
            "username": "tester",
            "email": "test@example.com",
        },
    )

    assert response.status_code == 400
    assert response.get_json()["error"] == "Username, email, and password are required."
    assert User.query.count() == 0


def test_register_rejects_duplicate_username(client):
    existing_user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(existing_user)
    db.session.commit()

    response = client.post(
        "/register",
        json={
            "username": "tester",
            "email": "other@example.com",
            "password": "super-secret",
        },
    )

    assert response.status_code == 409
    assert response.get_json()["error"] == "Username or email already exists"
    assert User.query.count() == 1


def test_register_rejects_duplicate_email(client):
    existing_user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(existing_user)
    db.session.commit()

    response = client.post(
        "/register",
        json={
            "username": "otheruser",
            "email": "test@example.com",
            "password": "super-secret",
        },
    )

    assert response.status_code == 409
    assert response.get_json()["error"] == "Username or email already exists"
    assert User.query.count() == 1


def test_login_sets_session_for_valid_credentials(client):
    client.post(
        "/register",
        json={
            "username": "tester",
            "email": "test@example.com",
            "password": "super-secret",
        },
    )

    client.post("/logout")

    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "super-secret",
        },
    )

    assert response.status_code == 200

    data = response.get_json()

    assert data["status"] == "Login successful."
    assert data["user"]["username"] == "tester"
    assert data["user"]["email"] == "test@example.com"
    assert "password" not in data["user"]

    user = User.query.filter_by(email="test@example.com").first()

    with client.session_transaction() as session:
        assert session["user_id"] == user.id


def test_login_rejects_invalid_credentials(client):
    client.post(
        "/register",
        json={
            "username": "tester",
            "email": "test@example.com",
            "password": "super-secret",
        },
    )

    client.post("/logout")

    response = client.post(
        "/login",
        json={
            "email": "test@example.com",
            "password": "wrong-password",
        },
    )

    assert response.status_code == 401
    assert response.get_json()["error"] == "Invalid email or password."

    with client.session_transaction() as session:
        assert "user_id" not in session


def test_get_current_user_returns_logged_in_user(client):
    user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.get("/me")

    assert response.status_code == 200
    assert response.get_json()["user"] == {
        "id": user.id,
        "username": "tester",
        "email": "test@example.com",
    }


def test_get_current_user_rejects_logged_out_user(client):
    response = client.get("/me")

    assert response.status_code == 401
    assert response.get_json()["user"] is None


def test_logout_clears_session(client):
    user = User(
        username="tester",
        email="test@example.com",
        password="hashed-password",
    )

    db.session.add(user)
    db.session.commit()

    with client.session_transaction() as session:
        session["user_id"] = user.id

    response = client.post("/logout")

    assert response.status_code == 200
    assert response.get_json()["status"] == "Logout successful"

    with client.session_transaction() as session:
        assert "user_id" not in session
