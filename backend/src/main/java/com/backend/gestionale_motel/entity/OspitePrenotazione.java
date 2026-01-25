package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ospite_prenotazione",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_ospite_prenotazione",
                columnNames = {"ospite_id", "prenotazione_id"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OspitePrenotazione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'ospite è obbligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ospite_id", nullable = false)
    private Ospite ospite;

    @NotNull(message = "La prenotazione è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prenotazione_id", nullable = false)
    private Prenotazione prenotazione;

    @NotNull(message = "Il campo titolare è obbligatorio")
    @Column(name = "titolare", nullable = false)
    @Builder.Default
    private Boolean titolare = false;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}

