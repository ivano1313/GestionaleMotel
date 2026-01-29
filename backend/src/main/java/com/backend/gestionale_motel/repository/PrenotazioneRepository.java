package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Camera;
import com.backend.gestionale_motel.entity.Prenotazione;
import com.backend.gestionale_motel.entity.StatoPrenotazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository per l'entity Prenotazione
 */

public interface PrenotazioneRepository extends JpaRepository<Prenotazione, Long> {

    /**
     * Filtra le prenotazioni per stato
     * @param stato lo stato della prenotazione
     * @return lista di prenotazioni con lo stato specificato
     */
    List<Prenotazione> findByStato(StatoPrenotazione stato);

    /**
     * Trova tutte le prenotazioni per una camera
     * @param camera la camera
     * @return lista di prenotazioni per la camera
     */
    List<Prenotazione> findByCamera(Camera camera);

    /**
     * Trova gli arrivi previsti per un giorno specifico
     * @param data la data da verificare
     * @return lista di prenotazioni con check-in nella data specificata
     */
    @Query("SELECT p FROM Prenotazione p WHERE p.dataCheckin = :data AND p.stato IN ('CONFERMATA', 'IN_CORSO')")
    List<Prenotazione> findArriviDelGiorno(@Param("data") LocalDate data);

    /**
     * Trova le partenze previste per un giorno specifico
     * @param data la data da verificare
     * @return lista di prenotazioni con check-out nella data specificata
     */
    @Query("SELECT p FROM Prenotazione p WHERE p.dataCheckout = :data AND p.stato = 'IN_CORSO'")
    List<Prenotazione> findPartenzeDelGiorno(@Param("data") LocalDate data);

    /**
     * Trova le prenotazioni attive in una data specifica
     * @param data la data da verificare
     * @return lista di prenotazioni attive nella data
     */
    @Query("SELECT p FROM Prenotazione p WHERE :data BETWEEN p.dataCheckin AND p.dataCheckout AND p.stato IN ('CONFERMATA', 'IN_CORSO')")
    List<Prenotazione> findPrenotazioniAttive(@Param("data") LocalDate data);

    /**
     * Verifica se esiste una sovrapposizione per una camera in un periodo
     * @param camera la camera da verificare
     * @param checkIn data di check-in
     * @param checkOut data di check-out
     * @return true se esiste sovrapposizione, false altrimenti
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Prenotazione p WHERE " +
           "p.camera = :camera AND p.stato IN ('CONFERMATA', 'IN_CORSO') AND " +
           "NOT (p.dataCheckout <= :checkIn OR p.dataCheckin >= :checkOut)")
    boolean existsSovrapposizione(@Param("camera") Camera camera,
                                   @Param("checkIn") LocalDate checkIn,
                                   @Param("checkOut") LocalDate checkOut);

    /**
     * Trova prenotazioni con check-in in un determinato range
     * @param da data di inizio range
     * @param a data di fine range
     * @return lista di prenotazioni nel range
     */
    List<Prenotazione> findByDataCheckinBetween(LocalDate da, LocalDate a);

    /**
     * Trova prenotazioni per data check-in e lista di stati
     * @param dataCheckin la data di check-in
     * @param stati lista di stati da includere
     * @return lista di prenotazioni corrispondenti
     */
    List<Prenotazione> findByDataCheckinAndStatoIn(LocalDate dataCheckin, List<StatoPrenotazione> stati);
}

