-- LINKS TABLE
-- Hay que corregir para adaptar al modelo propuesto para el proyecto
CREATE TABLE  oferta (
  id_oferta INT(11) NOT NULL AUTO_INCREMENT, 
  nombre_oferta VARCHAR(45) NOT NULL,
  descripcion VARCHAR(400) NOT NULL,
  id_usuario INT(11) NOT NULL,
  fechaCreacion TIMESTAMP NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_id_usuario FOREIGN KEY (id_usuario) REFERENCES users(id),
  PRIMARY KEY (id_oferta)
);
