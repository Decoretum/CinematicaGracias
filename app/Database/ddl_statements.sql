-- Updated CREATE Statements
CREATE TABLE Users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  sex CHAR(1) NOT NULL,
  birthday DATE NOT NULL, 
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL
);

CREATE TABLE Director (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  birthday DATE NOT NULL,
  sex CHAR(1) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE Actor (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  socmed TEXT[],
  img VARCHAR(255),
  birthday DATE NOT NULL,
  sex CHAR(1) NOT NULL,
  description TEXT NOT NULL
);


CREATE TABLE Film (
  id SERIAL PRIMARY KEY,
  director_fk INT REFERENCES Director(id),
  img VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  genres TEXT[] NOT NULL,
  date_released DATE NOT NULL,
  duration INT NOT NULL,
  frame_rate INT,
  content_rating VARCHAR(255),
  average_user_rating INT DEFAULT 0,
  description TEXT NOT NULL
);

CREATE TABLE Producer (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  birthday DATE NOT NULL,
  sex CHAR(1) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE Review (
  id SERIAL PRIMARY KEY,
  users_fk UUID REFERENCES Users(id),
  film_fk INT REFERENCES Film(id),
  content VARCHAR(255) NOT NULL,
  date_created DATE NOT NULL,
  date_updated DATE
);

CREATE TABLE FilmProducer (
  id SERIAL PRIMARY KEY,
  film_fk INT REFERENCES Film(id),
  producer_fk INT REFERENCES Producer(id) ON DELETE CASCADE,
);

CREATE TABLE FilmActor (
  id SERIAL PRIMARY KEY,
  film_fk INT REFERENCES Film(id),
  actor_fk INT REFERENCES Actor(id) ON DELETE CASCADE
);

-- Here are the INSERT Statements for data population
-- Directors
INSERT INTO Director (id, first_name, last_name, birthday, sex, description) VALUES
(1, 'Steven', 'Spielberg', '1946-12-18', 'M', 'Famous American filmmaker known for many blockbusters.');

INSERT INTO Director (id, first_name, last_name, birthday, sex, description) VALUES
(2, 'Sofia', 'Coppola', '1971-05-14', 'F', 'Renowned for her unique directing style and storytelling.');

INSERT INTO Director (id, first_name, last_name, birthday, sex, description) VALUES
(3, 'Christopher', 'Nolan', '1970-07-30', 'M', 'Known for mind-bending films and epic narratives.');

INSERT INTO Director (id, first_name, last_name, birthday, sex, description) VALUES
(4, 'Greta', 'Gerwig', '1983-08-04', 'F', 'Modern filmmaker with a focus on nuanced characters.');

INSERT INTO Director (id, first_name, last_name, birthday, sex, description) VALUES
(5, 'Quentin', 'Tarantino', '1963-03-27', 'M', 'Cult director known for stylized violence and storytelling.');


-- Actor
INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(1, 'Leonardo', 'DiCaprio', ARRAY['@leodicaprio'], '1974-11-11', 'M', 'Versatile and award-winning actor.');

INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(2, 'Scarlett', 'Johansson', ARRAY['@scarlettj'], '1984-11-22', 'F', 'Famous for diverse roles and voice acting.');

INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(3, 'Denzel', 'Washington', ARRAY['@denzelw'], '1954-12-28', 'M', 'Legendary actor with multiple awards.');

INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(4, 'Natalie', 'Portman', ARRAY['@natalieportman'], '1981-06-09', 'F', 'Academy Award-winning actress.');

INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(5, 'Tom', 'Hanks', ARRAY['@tomhanks'], '1956-07-09', 'M', 'Beloved actor known for dramatic and comedic roles.');


-- Film
INSERT INTO Film (id, director_fk, name, genres, date_released, duration, frame_rate, content_rating, average_user_rating, description) VALUES
(1, 1, 'Jurassic Park', ARRAY['Adventure', 'Sci-Fi'], '1993-06-11', 127, 24, 'PG-13', 9, 'Dinosaurs brought back to life with thrilling adventures.'),
(2, 2, 'Lost in Translation', ARRAY['Drama', 'Romance'], '2003-09-12', 102, 24, 'R', 8, 'Two lost souls find connection in Tokyo.'),
(3, 3, 'Inception', ARRAY['Sci-Fi', 'Thriller'], '2010-07-16', 148, 24, 'PG-13', 9, 'A mind-bending journey through dreams.'),
(4, 4, 'Lady Bird', ARRAY['Drama', 'Comedy'], '2017-11-03', 94, 24, 'R', 8, 'Coming-of-age story with humor and heart.'),
(5, 5, 'Pulp Fiction', ARRAY['Crime', 'Drama'], '1994-10-14', 154, 24, 'R', 9, 'Interwoven crime stories with iconic dialogue.');


-- producer
INSERT INTO Producer (id, first_name, last_name, birthday, sex, description) VALUES
(1, 'Kathleen', 'Kennedy', '1953-06-05', 'F', 'President of Lucasfilm and prominent producer.'),
(2, 'James', 'Cameron', '1954-08-16', 'M', 'Director and producer known for epic blockbusters.'),
(3, 'Jerry', 'Bruckheimer', '1943-09-21', 'M', 'Producer of high-budget action films.'),
(4, 'Ava', 'DuVernay', '1972-08-24', 'F', 'Filmmaker focused on social issues.'),
(5, 'David', 'Heyman', '1961-07-26', 'M', 'Known for producing the Harry Potter films.');


-- Review
-- INSERT INTO Review (users_fk, film_fk, content, date_created, date_updated, rating) VALUES
-- ('11111111-1111-1111-1111-111111111111', 1, 'Amazing special effects and story!', '2023-01-15', '2023-01-16', 5),
-- ('22222222-2222-2222-2222-222222222222', 2, 'Beautifully shot, emotional film.', '2023-02-10', NULL,4),
-- ('33333333-3333-3333-3333-333333333333', 3, 'Complex but rewarding experience.', '2023-03-05', '2023-03-06', 3),
-- ('44444444-4444-4444-4444-444444444444', 4, 'Relatable and heartwarming.', '2023-04-10', NULL, 2),
-- ('55555555-5555-5555-5555-555555555555', 5, 'Classic Tarantino style!', '2023-05-20', '2023-05-21', 1);

-- Film Producer
INSERT INTO FilmProducer (film_fk, producer_fk) VALUES
(1, 1),
(2, 4),
(3, 2),
(4, 4),
(5, 3);

-- Film Actor
INSERT INTO FilmActor (film_fk, actor_fk) VALUES
(1, 1),
(2, 2),
(3, 1),
(4, 4),
(5, 5);

-- DELETE statements to reset the Data
DELETE FROM filmactor;
DELETE FROM filmproducer;
DELETE FROM review;
DELETE FROM Film;
DELETE FROM Actor;
DELETE FROM Producer;
DELETE FROM director;





-- Log of all my DDL Queries during development

-- Alering Logs Table
-- ALTER TABLE Logs 
-- ADD COLUMN content VARCHAR(255) NOT NULL;

-- -- Altering Human entities and Film to add description
-- ALTER TABLE Actor
-- ADD COLUMN description TEXT NOT NULL;

-- ALTER TABLE Director
-- ADD COLUMN description TEXT NOT NULL;

-- ALTER TABLE producer
-- ADD COLUMN description TEXT NOT NULL;

-- ALTER TABLE Film
-- ADD COLUMN description TEXT NOT NULL;

-- -- Altering to rename column
-- ALTER TABLE Producer
-- RENAME COLUMN film_pk TO film_fk;

-- -- Altering to add rating field in Review
-- ALTER TABLE Review
-- ADD COLUMN rating SMALLINT NOT NULL;

-- -- Altering Film, Actor, and Producer to change their relationship
-- ALTER TABLE Film
-- DROP COLUMN actor_fk;

-- ALTER TABLE Producer
-- DROP COLUMN film_fk;

-- -- Deleting Log Table
-- DROP TABLE IF EXISTS Logs;

