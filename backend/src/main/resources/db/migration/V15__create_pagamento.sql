-- V15__create_pagamento.sql
-- Movimenti di pagamento associati alle prenotazioni

CREATE TABLE pagamento (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Riferimenti
                           prenotazione_id BIGINT NOT NULL,
                           metodo_pagamento_id BIGINT NOT NULL,

    -- Dati pagamento
                           importo DECIMAL(10,2) NOT NULL,
                           data_pagamento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- CHECK: importo non negativo
                           CONSTRAINT chk_pagamento_importo CHECK (importo >= 0),

    -- Foreign keys
                           CONSTRAINT fk_pagamento_prenotazione
                               FOREIGN KEY (prenotazione_id) REFERENCES prenotazione(id),
                           CONSTRAINT fk_pagamento_metodo
                               FOREIGN KEY (metodo_pagamento_id) REFERENCES metodo_pagamento(id)
);

-- Indici per ricerche frequenti
CREATE INDEX idx_pagamento_prenotazione ON pagamento(prenotazione_id);
CREATE INDEX idx_pagamento_data ON pagamento(data_pagamento);