package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "metodo_pagamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetodoPagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Il nome del metodo di pagamento è obbligatorio")
    @Size(max = 50, message = "Il nome non può superare i 50 caratteri")
    @Column(name = "nome", nullable = false, unique = true, length = 50)
    private String nome;

    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}
