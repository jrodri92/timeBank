CREATE DATABASE database_links;

USE database_links;

-- USERS TABLE
CREATE TABLE users (
  id INT(11) NOT NULL, 
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
  user_description VARCHAR(400),
  frase VARCHAR(100)
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

-- LINKS TABLE
CREATE TABLE  links (
  id INT(11) NOT NULL AUTO_INCREMENT, 
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE links
  ADD PRIMARY KEY (id);

DESCRIBE links;

CREATE TABLE  oferta (
  id_oferta INT(11) NOT NULL AUTO_INCREMENT, 
  nombre_oferta VARCHAR(45) NOT NULL,
  descripcion VARCHAR(400) NOT NULL,
  id_usuario INT(11) NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES users(id),
  PRIMARY KEY (id_oferta)
);


  DESCRIBE oferta;