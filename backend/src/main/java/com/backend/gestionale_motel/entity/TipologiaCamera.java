package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tipologia_camera")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipologiaCamera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome della tipologia è obbligatorio")
    @Size(max = 50, message = "Il nome non può superare i 50 caratteri")
    @Column(name = "nome", nullable = false, unique = true, length = 50)
    private String nome;

    @NotNull(message = "La capienza massima è obbligatoria")
    @Min(value = 1, message = "La capienza massima deve essere almeno 1")
    @Column(name = "capienza_massima", nullable = false)
    private Integer capienzaMassima;


    @Builder.Default
    @Column(name = "attivo", nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @OneToMany(mappedBy = "tipologia", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Camera> camere = new ArrayList<>();

    @OneToMany(mappedBy = "tipologia", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Tariffa> tariffe = new ArrayList<>();
}
