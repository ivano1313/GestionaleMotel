-- Tabella per le categorie di spesa
CREATE TABLE categoria_spesa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descrizione VARCHAR(255),
    attivo BOOLEAN NOT NULL DEFAULT TRUE,
    data_creazione TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
