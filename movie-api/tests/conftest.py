import os

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from app import app, db


@pytest.fixture()
def client():
    app.config.update(
        TESTING=True,
        SECRET_KEY="test-secret",
    )

    with app.app_context():
        db.create_all()

        with app.test_client() as client:
            yield client

        db.session.remove()
        db.drop_all()
