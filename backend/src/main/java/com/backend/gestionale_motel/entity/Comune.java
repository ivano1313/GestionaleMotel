package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(
    name = "comune",
    indexes = {
        @Index(name = "idx_comune_nome", columnList = "nome"),
        @Index(name = "idx_comune_provincia", columnList = "provincia")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comune {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il codice è obbligatorio")
    @Size(max = 9, message = "Il codice non può superare i 9 caratteri")
    @Column(name = "codice", nullable = false, unique = true, length = 9)
    private String codice;

    @NotBlank(message = "Il nome è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "La provincia è obbligatoria")
    @Size(max = 2, message = "La provincia non può superare i 2 caratteri")
    @Column(name = "provincia", nullable = false, length = 2)
    private String provincia;
}

