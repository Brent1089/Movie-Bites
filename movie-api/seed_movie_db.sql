CREATE DATABASE IF NOT EXISTS movie_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE movie_db;

DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
);

CREATE TABLE movies (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  year VARCHAR(4),
  genre VARCHAR(50),
  age_rating VARCHAR(10),
  description TEXT,
  poster_url VARCHAR(500),
  star_rating VARCHAR(5),
  comment TEXT,
  PRIMARY KEY (id),
  CONSTRAINT fk_movies_user
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO movies
  (id, user_id, title, year, genre, age_rating, description, poster_url, star_rating, comment)
VALUES
  (1, NULL, 'The Thing', '1982', 'horror', 'R', 'A research team in Antarctica discovers a shape-shifting alien that can perfectly imitate any living being, leading to paranoia and mistrust as they try to survive.', 'https://image.tmdb.org/t/p/w500/a9RjXOIIB56k2rGoL3Fk3nRHHHQ.jpg', '5', 'An absolute classic of sci-fi horror. Some of the best practical effects in a horror movie to this very day.'),
  (2, NULL, 'Blade Runner', '1982', 'sci-fi', 'R', 'A detective hunts down rogue synthetic humans known as replicants in a dystopian future where identity and humanity blur together.', 'https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg', '4', 'A visually stunning and philosophical sci-fi noir masterpiece.'),
  (3, NULL, 'Alien', '1979', 'horror', 'R', 'A commercial space crew investigates a mysterious signal and brings aboard a deadly extraterrestrial organism that hunts them one by one.', 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg', '5', 'Tense, atmospheric, and endlessly rewatchable.'),
  (4, NULL, 'The Matrix', '1999', 'sci-fi', 'R', 'A hacker discovers that reality is a simulated construct and joins a rebellion fighting for humanity''s freedom.', 'https://image.tmdb.org/t/p/w500/qK76PKQLd6zlMn0u83Ej9YQOqPL.jpg', '4', 'A groundbreaking action film with big ideas and iconic visuals.'),
  (5, NULL, 'The Room', '2003', 'drama', 'R', 'A melodramatic tale of love, betrayal, and broken relationships, infamous for its bizarre writing, strange performances, and unintentional comedy.', 'https://image.tmdb.org/t/p/w500/9w8BuwfT96t2B26e2eW3ttz8jwK.jpg', '1', 'So bad it''s legendary - a cult classic of unintentional comedy.'),
  (6, NULL, 'The Shawshank Redemption', '1994', 'drama', 'R', 'Two imprisoned men form an unlikely, enduring friendship while quietly resisting the harshness of life behind bars.', 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', '5', 'A touching, perfectly paced drama about hope and perseverance.'),
  (7, NULL, 'Jurassic Park', '1993', 'adventure', 'PG-13', 'Scientists resurrect dinosaurs for a theme park, only for the creatures to escape and unleash chaos.', 'https://image.tmdb.org/t/p/w500/bRKmwU9eXZI5dKT11Zx1KsayiLW.jpg', '4', 'A thrilling blend of adventure, science, and unforgettable effects.'),
  (8, NULL, 'Inception', '2010', 'sci-fi', 'PG-13', 'A skilled thief enters people''s dreams to steal secrets but is offered a chance at redemption if he can implant an idea instead.', 'https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg', '5', 'Mind-bending sci-fi with incredible action and emotional depth.'),
  (9, NULL, 'Nope', '2022', 'horror', 'R', 'Residents of a remote California ranch encounter a mysterious presence in the sky, unleashing a strange, escalating threat.', 'https://image.tmdb.org/t/p/w500/AcKVlWaNVVVFQwro3nLXqPljcYA.jpg', '3', 'A surreal, unsettling spectacle with unique ideas and striking imagery.'),
  (10, NULL, 'Birdemic: Shock and Terror', '2010', 'horror', 'PG-13', 'A small town is attacked by crudely animated birds in one of the most notoriously low-budget and unintentionally hilarious films ever made.', 'https://image.tmdb.org/t/p/w500/1eTkbuvz1Enzu7R6Vhgb7kbNiAi.jpg', '1', 'A masterpiece of accidental comedy - unbelievably bad in every possible way.');
