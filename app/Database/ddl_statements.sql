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
(1, 'Steven', 'Spielberg', '1946-12-18', 'm', 'Famous American filmmaker who pioneered modern blockbusters with films like Jaws, E.T., and Jurassic Park.'),
(2, 'Sofia', 'Coppola', '1971-05-14', 'f', 'Known for atmospheric storytelling, Sofia Coppola creates deeply personal and visually stunning narratives.'),
(3, 'Christopher', 'Nolan', '1970-07-30', 'm', 'Renowned for complex narratives, Nolan crafts intelligent blockbusters like Inception and The Dark Knight.'),
(4, 'Greta', 'Gerwig', '1983-08-04', 'f', 'Acclaimed for her feminist themes and distinct voice, Greta Gerwig brings depth to modern character-driven films.'),
(5, 'Quentin', 'Tarantino', '1963-03-27', 'm', 'Known for stylized violence, nonlinear storytelling, and rich dialogue in cult classics like Pulp Fiction and Kill Bill.');


-- Actor
INSERT INTO Actor (id, first_name, last_name, socmed, birthday, sex, description) VALUES
(1, 'Leonardo', 'DiCaprio', ARRAY['@instagram||https://www.instagram.com/leonardodicaprio'], '1974-11-11', 'm', 'Oscar-winning actor known for roles in Titanic, Inception, and his climate change activism through social media.'),
(2, 'Scarlett', 'Johansson', ARRAY['@instagram||https://www.instagram.com/scarlettjohanssonworld'], '1984-11-22', 'f', 'Famed for her versatility in action and drama, Scarlett shines in the MCU and indie cinema alike with passion.'),
(3, 'Denzel', 'Washington', ARRAY['@instagram||https://www.instagram.com/denzelwashington.official'], '1954-12-28', 'm', 'Highly respected for powerful performances, Denzel has won multiple Oscars and inspires future generations of actors.'),
(4, 'Natalie', 'Portman', ARRAY['@instagram||https://www.instagram.com/natalieportman'], '1981-06-09', 'f', 'Oscar-winning actress known for intelligent and emotionally rich performances in both indie and blockbuster films.'),
(5, 'Tom', 'Hanks', ARRAY['@instagram||https://www.instagram.com/tomhanks'], '1956-07-09', 'm', 'Beloved for his warm screen presence, Tom Hanks has portrayed iconic roles in Forrest Gump, Cast Away, and Toy Story.');


-- Film
INSERT INTO Film (id, director_fk, name, genres, date_released, duration, frame_rate, content_rating, average_user_rating, description) VALUES
(1, 1, 'Jurassic Park', ARRAY['ADVENTURE', 'Sci-Fi'], '1993-06-11', 127, 24, 'PG-13', 0, 'Dinosaurs come to life in this thrilling adventure directed by Spielberg, featuring groundbreaking visual effects.'),
(2, 2, 'Lost in Translation', ARRAY['DRAMA', 'ROMANCE'], '2003-09-12', 102, 24, 'R', 0, 'A quiet, emotional connection forms between two strangers in Tokyo, exploring loneliness and cultural dislocation.'),
(3, 3, 'Inception', ARRAY['SCI-FI', 'THRILLER'], '2010-07-16', 148, 24, 'PG-13', 0, 'Nolan directs a mind-bending thriller about dream invasion and reality, featuring stunning visuals and complex plots.'),
(4, 4, 'Lady Bird', ARRAY['DRAMA', 'COMEDY'], '2017-11-03', 94, 24, 'R', 0, 'A heartfelt coming-of-age story exploring a teenager’s relationship with her mother and her dreams for independence.'),
(5, 5, 'Pulp Fiction', ARRAY['CRIME', 'DRAMA'], '1994-10-14', 154, 24, 'R', 0, 'A nonlinear crime film with dark humor, iconic characters, and unforgettable dialogue from cult director Tarantino.');



-- producer
INSERT INTO Producer (id, first_name, last_name, birthday, sex, description) VALUES
(1, 'Kathleen', 'Kennedy', '1953-06-05', 'f', 'Award-winning producer and head of Lucasfilm, known for shaping Star Wars and Indiana Jones franchises.'),
(2, 'James', 'Cameron', '1954-08-16', 'm', 'Visionary behind Titanic and Avatar, known for pushing the limits of filmmaking technology and storytelling.'),
(3, 'Jerry', 'Bruckheimer', '1943-09-21', 'm', 'Blockbuster producer with hits like Pirates of the Caribbean and Top Gun, blending action and strong characters.'),
(4, 'Ava', 'DuVernay', '1972-08-24', 'f', 'Director and producer of socially impactful films like Selma and When They See Us, breaking industry barriers.'),
(5, 'David', 'Heyman', '1961-07-26', 'm', 'Produced the Harry Potter series and other acclaimed films, fostering imagination and emotional storytelling globally.');



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