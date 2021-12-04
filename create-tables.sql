DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  nome_loja VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL,
  nome VARCHAR(100) NOT NULL,
  quantidade INT NOT NULL,
  categoria VARCHAR(150),
  preco BIGINT NOT NULL,
  descricao VARCHAR(200) NOT NULL,
  imagem TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);