-- V9__create_stato.sql
-- Tabella lookup per gli stati (schedina alloggiati)

CREATE TABLE stato (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       codice VARCHAR(9) NOT NULL,
                       nome VARCHAR(100) NOT NULL,

                       CONSTRAINT uk_stato_codice UNIQUE (codice),
                       CONSTRAINT uk_stato_nome UNIQUE (nome)
);