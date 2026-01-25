package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalTime;

/**
 * Tabella Singleton - contiene una sola riga con id = 1
 * Parametri globali del sistema
 */
@Entity
@Table(name = "configurazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Configurazione {

    @Id
    @Column(name = "id")
    @Builder.Default
    private Long id = 1L;

    @NotNull(message = "L'orario di check-in è obbligatorio")
    @Column(name = "orario_checkin", nullable = false)
    private LocalTime orarioCheckin;

    @NotNull(message = "L'orario di check-out è obbligatorio")
    @Column(name = "orario_checkout", nullable = false)
    private LocalTime orarioCheckout;

    @NotNull(message = "La durata minima è obbligatoria")
    @Min(value = 1, message = "La durata minima deve essere almeno 1 notte")
    @Column(name = "durata_minima", nullable = false)
    private Integer durataMinima;

    @NotNull(message = "La durata massima è obbligatoria")
    @Column(name = "durata_massima", nullable = false)
    private Integer durataMassima;

    @AssertTrue(message = "La durata massima deve essere maggiore o uguale alla durata minima")
    public boolean isDurataValid() {
        if (durataMinima == null || durataMassima == null) {
            return true; // Let @NotNull handle null validation
        }
        return durataMassima >= durataMinima;
    }
}

