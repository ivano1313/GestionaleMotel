package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Configurazione;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository per l'entity Configurazione
 * Tabella singleton - contiene una sola riga con id = 1
 */
@Repository
public interface ConfigurazioneRepository extends JpaRepository<Configurazione, Long> {

    /**
     * Recupera l'unica istanza di configurazione (singleton)
     * @return Optional contenente la configurazione se presente
     */
    @Query("SELECT c FROM Configurazione c WHERE c.id = 1")
    Optional<Configurazione> findSingleton();
}

