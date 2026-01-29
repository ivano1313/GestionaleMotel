# Roadmap / TODO

Funzionalità future da implementare.

## Priorità Media

| Funzionalità | Stato | Note |
|--------------|-------|------|
| Contabilità base | ✅ Fatto | Tracciare entrate e uscite, bilancio mensile |
| Registro spese/uscite | ✅ Fatto | Spese operative, utenze, manutenzione |
| Report incassi | ✅ Fatto | Per periodo, per metodo di pagamento |

## Priorità Bassa

| Funzionalità | Stato | Note |
|--------------|-------|------|
| Tipo pagamento (Acconto/Saldo/Caparra) | ✅ Fatto | Campo dedicato con enum |
| Export dati per commercialista | ✅ Fatto | CSV con movimenti entrate/uscite |

## Non Previste

| Funzionalità | Motivo |
|--------------|--------|
| Integrazione POS | Motel piccolo, POS esterno sufficiente (SumUp) |

## Note Tecniche

- Il POS resta separato, i pagamenti si registrano manualmente
- Tipo pagamento gestito con enum: ACCONTO, CAPARRA, SALDO

## Decisioni Tecniche Prese

1. **POS esterno:** Per un motel piccolo, il POS resta separato (SumUp o simile). I pagamenti si registrano manualmente nel gestionale.

2. **Tipo pagamento:** Implementato con enum (ACCONTO, CAPARRA, SALDO) e campo dedicato nel database.
