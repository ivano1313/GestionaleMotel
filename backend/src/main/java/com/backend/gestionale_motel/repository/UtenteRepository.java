package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity Utente
 * Gestisce le operazioni di accesso ai dati per gli utenti del sistema
 */
@Repository
public interface UtenteRepository extends JpaRepository<Utente, Long> {

    /**
     * Ricerca un utente per username
     * @param username lo username dell'utente
     * @return Optional contenente l'utente se trovato
     */
    Optional<Utente> findByUsername(String username);

    /**
     * Verifica se esiste un utente con lo username specificato
     * @param username lo username da verificare
     * @return true se esiste, false altrimenti
     */
    boolean existsByUsername(String username);

    /**
     * Filtra gli utenti per stato attivo
     * @param attivo lo stato attivo (true/false)
     * @return lista di utenti con lo stato specificato
     */
    List<Utente> findByAttivo(boolean attivo);
}

