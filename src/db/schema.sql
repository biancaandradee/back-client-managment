CREATE DATABASE client_management;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
	id serial PRIMARY KEY,
	email_usuario text NOT NULL UNIQUE,
	senha text NOT NULL,
	nome_usuario text NOT NULL,
	cpf_usuario varchar(25) UNIQUE,
	telefone_usuario text
);

DROP TABLE IF EXISTS clientes;

CREATE TABLE IF NOT EXISTS clientes (
	id serial PRIMARY KEY,
	nome_cliente text NOT NULL,
	email_cliente text NOT NULL UNIQUE,
	cpf_cliente varchar(25) NOT NULL UNIQUE,
	telefone_cliente text NOT NULL,
	cep varchar(10),
	logradouro text,
	complemento text,
	bairro text,
	cidade varchar(150),
	estado varchar(50),
);

CREATE TYPE status_cobranca AS ENUM('Paga', 'Pendente');

DROP TABLE IF EXISTS cobrancas;

CREATE TABLE IF NOT EXISTS cobrancas (
	id serial PRIMARY KEY,
    cliente_id integer NOT NULL,
    valor decimal NOT NULL,
    data_vencimento date NOT NULL,
    status status_cobranca NOT NULL,
    descricao text NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

