-- Tabella per le spese/uscite
CREATE TABLE spesa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    descrizione VARCHAR(255) NOT NULL,
    importo DECIMAL(10, 2) NOT NULL,
    data_spesa DATE NOT NULL,
    note TEXT,
    attivo BOOLEAN NOT NULL DEFAULT TRUE,
    data_creazione TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_spesa_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_spesa(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indice per ricerche per data
CREATE INDEX idx_spesa_data ON spesa(data_spesa);

-- Indice per ricerche per categoria
CREATE INDEX idx_spesa_categoria ON spesa(categoria_id);
