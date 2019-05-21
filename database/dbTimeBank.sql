-- LINKS TABLE
-- Hay que corregir para adaptar al modelo propuesto para el proyecto

CREATE DATABASE timeitBank;

-- using the database

use timeitBank;

-- creating tables
CREATE TABLE usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT, 
  cedula INT NOT NULL,
  nombres VARCHAR(45) NOT NULL,
  apellidos VARCHAR(45) NOT NULL,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(60) NOT NULL,
  email VARCHAR(45) NOT NULL,
  fechaNacimineto DATE NOT NULL,
  telefono VARCHAR(45) NOT NULL,
  celular VARCHAR(45) NOT NULL,
  user_description VARCHAR(400) NOT NULL,
  frase VARCHAR(100) NOT NULL, 
  PRIMARY KEY (id_usuario)
);
ALTER TABLE usuarios
  MODIFY id_usuario INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;


CREATE TABLE  ofertas (
  id_oferta INT(11) NOT NULL AUTO_INCREMENT, 
  id_usuario INT(11) NOT NULL,
  nombre_oferta VARCHAR(45) NOT NULL,
  oferta_descripcion VARCHAR(400) NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id_oferta),
  CONSTRAINT fk_id_usuario_oferta FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE categorias(
	id_categoria INT NOT NULL AUTO_INCREMENT,
  categoria_descripcion VARCHAR(200) NOT NULL,
  PRIMARY KEY (id_categoria)
);
ALTER TABLE categorias ADD COLUMN nombre VARCHAR(100) AFTER id_categoria;

CREATE TABLE oferta_categoria(
  id_oferta_categoria INT NOT NULL AUTO_INCREMENT,
  id_categoria INT NOT NULL,
  id_oferta INT NOT NULL,
  PRIMARY KEY(id_oferta_categoria),
  
  CONSTRAINT fk_id_oferta_of_ca FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  
  CONSTRAINT fk_id_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE tiempo (
  id_tiempo INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  valorTiempo INT NOT NULL,
  PRIMARY KEY(id_tiempo),
  
  CONSTRAINT fk_id_usuario_tiempo FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE 
);

CREATE TABLE calificaciones (
  id_calificacion INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  valorCalificacion INT NOT NULL,
  PRIMARY KEY(id_calificacion),
  
  CONSTRAINT fk_id_usuario_calificacion FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);

CREATE TABLE solicitudes (
  id_solicitud INT NOT NULL AUTO_INCREMENT,
  id_oferta INT NOT NULL,
  id_usuario INT NOT NULL,
  tiempoOferta INT NOT NULL,
  solicitud_descripcion VARCHAR(400) NOT NULL,
  estadoSolicitud BOOLEAN,
  fechaSolicitud TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY(id_solicitud),
  
  CONSTRAINT fk_id_usuario_solicitud FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
  ON DELETE CASCADE
  ON UPDATE CASCADE, 
  
  CONSTRAINT fk_id_oferta_solicitud FOREIGN KEY (id_oferta) REFERENCES ofertas(id_oferta)
  ON DELETE CASCADE
  ON UPDATE CASCADE 
);

CREATE TABLE transacciones (
  id_transaccion INT NOT NULL AUTO_INCREMENT,
  id_solicitud INT NOT NULL,
  fechaTransaccion TIMESTAMP NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (id_transaccion),
  
  CONSTRAINT fk_id_solicitud FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
  ON DELETE CASCADE
  ON UPDATE CASCADE 
);

--insersiones
INSERT INTO `timeitBank`.`categorias` (`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES (1,"aseo","");
INSERT INTO `timeitBank`.`categorias`(`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES(2,"belleza","");
INSERT INTO `timeitBank`.`categorias`(`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES(3,"cocina","");
INSERT INTO `timeitBank`.`categorias`(`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES(4,"educacion","");
INSERT INTO `timeitBank`.`categorias`(`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES(5,"reparacion","");
INSERT INTO `timeitBank`.`categorias`(`id_categoria`,`nombre`,`categoria_descripcion`)
VALUES(6,"tecnologia","");