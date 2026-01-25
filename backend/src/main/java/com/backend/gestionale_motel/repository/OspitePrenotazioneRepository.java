package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Ospite;
import com.backend.gestionale_motel.entity.OspitePrenotazione;
import com.backend.gestionale_motel.entity.Prenotazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity OspitePrenotazione
 */
@Repository
public interface OspitePrenotazioneRepository extends JpaRepository<OspitePrenotazione, Long> {

    /**
     * Trova tutti gli ospiti associati a una prenotazione
     * @param prenotazione la prenotazione
     * @return lista di associazioni ospite-prenotazione
     */
    List<OspitePrenotazione> findByPrenotazione(Prenotazione prenotazione);

    /**
     * Trova tutte le prenotazioni di un ospite
     * @param ospite l'ospite
     * @return lista di associazioni ospite-prenotazione
     */
    List<OspitePrenotazione> findByOspite(Ospite ospite);

    /**
     * Trova l'ospite titolare di una prenotazione
     * @param prenotazione la prenotazione
     * @return Optional contenente l'associazione del titolare
     */
    @Query("SELECT op FROM OspitePrenotazione op WHERE op.prenotazione = :prenotazione AND op.titolare = true")
    Optional<OspitePrenotazione> findTitolare(@Param("prenotazione") Prenotazione prenotazione);

    /**
     * Conta il numero di ospiti associati a una prenotazione
     * @param prenotazione la prenotazione
     * @return numero di ospiti
     */
    long countByPrenotazione(Prenotazione prenotazione);
}

