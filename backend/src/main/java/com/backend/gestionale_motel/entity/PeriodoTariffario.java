package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "periodo_tariffario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodoTariffario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome del periodo tariffario è obbligatorio")
    @Size(max = 50, message = "Il nome non può superare i 50 caratteri")
    @Column(nullable = false, unique = true, length = 50)
    private String nome;

    @NotNull(message = "La data di inizio è obbligatoria")
    @Column(name = "data_inizio", nullable = false)
    private LocalDate dataInizio;

    @NotNull(message = "La data di fine è obbligatoria")
    @Column(name = "data_fine", nullable = false)
    private LocalDate dataFine;

    @Builder.Default
    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}
