from app import db

class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(4))
    genre = db.Column(db.String(50))
    age_rating = db.Column(db.String(10))
    description = db.Column(db.Text)
    poster_url = db.Column(db.String(500))
    star_rating = db.Column(db.String(5))
    comment = db.Column(db.Text)

    def to_dict(self):
        """Converts the database row object into a dictionary for JSON responses"""
        return {
            "id": self.id,
            "title": self.title,
            "year": self.year,
            "genre": self.genre,
            "age_rating": self.age_rating,
            "description": self.description,
            "poster_url": self.poster_url,
            "star_rating": self.star_rating,
            "comment": self.comment
        }


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        """Converts the database row object into a dictionary for JSON responses"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }
