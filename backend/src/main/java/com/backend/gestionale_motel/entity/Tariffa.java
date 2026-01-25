package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "tariffa",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_tariffa_tipologia_periodo",
        columnNames = {"tipologia_id", "periodo_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tariffa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La tipologia camera è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipologia_id", nullable = false)
    private TipologiaCamera tipologia;

    @NotNull(message = "Il periodo tariffario è obbligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_id", nullable = false)
    private PeriodoTariffario periodo;

    @NotNull(message = "Il prezzo è obbligatorio")
    @Min(value = 0, message = "Il prezzo non può essere negativo")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prezzo;

    @Builder.Default
    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}

