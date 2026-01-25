package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tipo_documento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoDocumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La sigla è obbligatoria")
    @Size(max = 5, message = "La sigla non può superare i 5 caratteri")
    @Column(name = "sigla", nullable = false, unique = true, length = 5)
    private String sigla;

    @NotBlank(message = "La descrizione è obbligatoria")
    @Size(max = 100, message = "La descrizione non può superare i 100 caratteri")
    @Column(name = "descrizione", nullable = false, length = 100)
    private String descrizione;

    @Builder.Default
    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}

