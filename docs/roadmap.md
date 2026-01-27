# Roadmap / TODO

Funzionalità future da implementare.

## Priorità Media

| Funzionalità | Stato | Note |
|--------------|-------|------|
| Contabilità base | Da fare | Tracciare entrate e uscite, bilancio mensile |
| Registro spese/uscite | Da fare | Spese operative, utenze, manutenzione |
| Report incassi | Da fare | Per periodo, per metodo di pagamento |

## Priorità Bassa

| Funzionalità | Stato | Note |
|--------------|-------|------|
| Tipo pagamento (Acconto/Saldo/Caparra) | Da fare | Per ora usare campo note |
| Export dati per commercialista | Da fare | CSV/Excel con movimenti |

## Non Previste

| Funzionalità | Motivo |
|--------------|--------|
| Integrazione POS | Motel piccolo, POS esterno sufficiente (SumUp) |

## Note Tecniche

- Per gli acconti usare il campo `note` del pagamento (es. "Acconto", "Caparra", "Saldo")
- Il POS resta separato, i pagamenti si registrano manualmente
- La contabilità completa richiederà nuove entità: `Spesa`, `CategoriaSpesa`, `MovimentoCassa`

## Decisioni Tecniche Prese

1. **POS esterno:** Per un motel piccolo, il POS resta separato (SumUp o simile). I pagamenti si registrano manualmente nel gestionale.

2. **Acconti:** Per ora usare il campo `note` del pagamento. Un campo dedicato potrà essere aggiunto in futuro se necessario.

3. **Contabilità:** Rimandata a fase successiva.
