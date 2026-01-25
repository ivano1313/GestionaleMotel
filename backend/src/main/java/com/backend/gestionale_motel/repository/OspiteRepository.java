package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Ospite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity Ospite
 */
@Repository
public interface OspiteRepository extends JpaRepository<Ospite, Long> {

    /**
     * Ricerca un ospite per numero documento
     * @param numero il numero del documento
     * @return Optional contenente l'ospite se trovato
     */
    Optional<Ospite> findByNumeroDocumento(String numero);

    /**
     * Ricerca ospiti per cognome (case insensitive, ricerca parziale)
     * @param cognome il cognome da cercare
     * @return lista di ospiti con cognome simile
     */
    List<Ospite> findByCognomeContainingIgnoreCase(String cognome);

    /**
     * Ricerca generica per termine in nome, cognome o documento
     * @param termine il termine da cercare
     * @return lista di ospiti che corrispondono al termine
     */
    @Query("SELECT o FROM Ospite o WHERE " +
           "LOWER(o.nome) LIKE LOWER(CONCAT('%', :termine, '%')) OR " +
           "LOWER(o.cognome) LIKE LOWER(CONCAT('%', :termine, '%')) OR " +
           "LOWER(o.numeroDocumento) LIKE LOWER(CONCAT('%', :termine, '%'))")
    List<Ospite> searchByTermine(@Param("termine") String termine);

    /**
     * Ricerca ospiti per nome e cognome esatti
     * @param nome il nome dell'ospite
     * @param cognome il cognome dell'ospite
     * @return lista di ospiti con nome e cognome specificati
     */
    List<Ospite> findByNomeAndCognome(String nome, String cognome);

    /**
     * Trova ospiti simili per nome, cognome o documento
     * @param nome il nome da cercare
     * @param cognome il cognome da cercare
     * @param documento il numero documento da cercare
     * @return lista di ospiti con dati simili
     */
    @Query("SELECT o FROM Ospite o WHERE " +
           "LOWER(o.nome) LIKE LOWER(CONCAT('%', :nome, '%')) OR " +
           "LOWER(o.cognome) LIKE LOWER(CONCAT('%', :cognome, '%')) OR " +
           "o.numeroDocumento = :documento")
    List<Ospite> findOspitiSimili(@Param("nome") String nome,
                                   @Param("cognome") String cognome,
                                   @Param("documento") String documento);
}

