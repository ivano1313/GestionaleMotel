package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prenotazione")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La camera è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "camera_id", nullable = false)
    private Camera camera;

    @NotNull(message = "La data di check-in è obbligatoria")
    @Column(name = "data_checkin", nullable = false)
    private LocalDate dataCheckin;

    @NotNull(message = "La data di check-out è obbligatoria")
    @Column(name = "data_checkout", nullable = false)
    private LocalDate dataCheckout;

    @NotNull(message = "Lo stato della prenotazione è obbligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "stato", nullable = false, length = 20)
    private StatoPrenotazione stato;

    @NotNull(message = "Il prezzo totale è obbligatorio")
    @DecimalMin(value = "0.0", message = "Il prezzo totale non può essere negativo")
    @Column(name = "prezzo_totale", nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzoTotale;

    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @AssertTrue(message = "La data di check-out deve essere successiva alla data di check-in")
    public boolean isDateValid() {
        if (dataCheckin == null || dataCheckout == null) {
            return true; // Let @NotNull handle null validation
        }
        return dataCheckout.isAfter(dataCheckin);
    }
}

