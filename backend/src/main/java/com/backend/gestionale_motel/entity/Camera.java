package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "camera")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Camera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il numero della camera è obbligatorio")
    @Size(max = 10, message = "Il numero non può superare i 10 caratteri")
    @Column(name = "numero", nullable = false, unique = true, length = 10)
    private String numero;

    @NotNull(message = "Lo stato pulizia è obbligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "stato_pulizia", nullable = false, length = 20)
    @Builder.Default
    private StatoPulizia statoPulizia = StatoPulizia.PULITA;

    @NotNull(message = "La tipologia è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipologia_id", nullable = false)
    private TipologiaCamera tipologia;

    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}

