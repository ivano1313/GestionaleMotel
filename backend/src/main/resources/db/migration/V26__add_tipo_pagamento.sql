-- Aggiunge colonna tipo_pagamento alla tabella pagamento
ALTER TABLE pagamento
ADD COLUMN tipo_pagamento VARCHAR(20) DEFAULT 'SALDO';

-- Imposta tutti i pagamenti esistenti come SALDO
UPDATE pagamento SET tipo_pagamento = 'SALDO' WHERE tipo_pagamento IS NULL;
