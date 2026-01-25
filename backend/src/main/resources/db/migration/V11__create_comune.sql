-- V11__create_comune.sql
-- Tabella lookup per i comuni italiani (schedina alloggiati)
-- NOTA: I dati verranno importati da CSV ufficiale del Portale Alloggiati

CREATE TABLE comune (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        codice VARCHAR(9) NOT NULL,
                        nome VARCHAR(100) NOT NULL,
                        provincia VARCHAR(2) NOT NULL,

                        CONSTRAINT uk_comune_codice UNIQUE (codice)
);

-- Indice per ricerche per nome (autocomplete nell'interfaccia)
CREATE INDEX idx_comune_nome ON comune(nome);

-- Indice per filtro per provincia
CREATE INDEX idx_comune_provincia ON comune(provincia);