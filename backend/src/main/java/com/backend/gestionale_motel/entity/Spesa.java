package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "spesa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Spesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La categoria è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private CategoriaSpesa categoria;

    @NotBlank(message = "La descrizione è obbligatoria")
    @Size(max = 255, message = "La descrizione non può superare i 255 caratteri")
    @Column(name = "descrizione", nullable = false, length = 255)
    private String descrizione;

    @NotNull(message = "L'importo è obbligatorio")
    @DecimalMin(value = "0.01", message = "L'importo deve essere maggiore di zero")
    @Column(name = "importo", nullable = false, precision = 10, scale = 2)
    private BigDecimal importo;

    @NotNull(message = "La data della spesa è obbligatoria")
    @Column(name = "data_spesa", nullable = false)
    private LocalDate dataSpesa;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}
