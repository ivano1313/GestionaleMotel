package com.backend.gestionale_motel.repository;

import com.backend.gestionale_motel.entity.Camera;
import com.backend.gestionale_motel.entity.StatoPulizia;
import com.backend.gestionale_motel.entity.TipologiaCamera;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository per l'entity Camera
 */
@Repository
public interface CameraRepository extends JpaRepository<Camera, Long> {

    /**
     * Filtra le camere per tipologia
     * @param tipologia la tipologia di camera
     * @return lista di camere della tipologia specificata
     */
    List<Camera> findByTipologia(TipologiaCamera tipologia);

    /**
     * Filtra le camere per stato pulizia
     * @param stato lo stato di pulizia
     * @return lista di camere con lo stato specificato
     */
    List<Camera> findByStatoPulizia(StatoPulizia stato);

    /**
     * Ricerca una camera per numero
     * @param numero il numero della camera
     * @return Optional contenente la camera se trovata
     */
    Optional<Camera> findByNumero(String numero);

    /**
     * Trova le camere disponibili in un determinato periodo
     * @param checkIn data di check-in
     * @param checkOut data di check-out
     * @return lista di camere disponibili
     */
    @Query("SELECT c FROM Camera c WHERE c.id NOT IN " +
           "(SELECT p.camera.id FROM Prenotazione p WHERE " +
           "p.stato IN ('CONFERMATA', 'OCCUPATA') AND " +
           "NOT (p.dataCheckout <= :checkIn OR p.dataCheckin >= :checkOut))")
    List<Camera> findCamereDisponibili(@Param("checkIn") LocalDate checkIn,
                                       @Param("checkOut") LocalDate checkOut);
}

