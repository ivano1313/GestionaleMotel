package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Stato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity Stato
 * Tabella lookup per gli stati/nazioni
 */
@Repository
public interface StatoRepository extends JpaRepository<Stato, Long> {

    /**
     * Ricerca uno stato per codice
     * @param codice il codice dello stato
     * @return Optional contenente lo stato se trovato
     */
    Optional<Stato> findByCodice(String codice);

    /**
     * Ricerca stati per nome (ricerca parziale)
     * @param nome il nome da cercare
     * @return lista di stati con nome contenente la stringa
     */
    List<Stato> findByNomeContaining(String nome);
}

