package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Pagamento;
import com.backend.gestionale_motel.entity.Prenotazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository per l'entity Pagamento
 */
@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long> {

    /**
     * Trova tutti i pagamenti di una prenotazione
     * @param prenotazione la prenotazione
     * @return lista di pagamenti
     */
    List<Pagamento> findByPrenotazione(Prenotazione prenotazione);

    /**
     * Calcola la somma degli importi pagati per una prenotazione
     * @param prenotazione la prenotazione
     * @return importo totale pagato
     */
    @Query("SELECT COALESCE(SUM(p.importo), 0) FROM Pagamento p WHERE p.prenotazione = :prenotazione")
    BigDecimal sumImportoByPrenotazione(@Param("prenotazione") Prenotazione prenotazione);

    /**
     * Trova i pagamenti effettuati in un determinato periodo
     * @param da data/ora di inizio
     * @param a data/ora di fine
     * @return lista di pagamenti nel periodo
     */
    List<Pagamento> findByDataPagamentoBetween(LocalDateTime da, LocalDateTime a);
}

