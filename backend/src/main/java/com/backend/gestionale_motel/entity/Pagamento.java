package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagamento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La prenotazione è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prenotazione_id", nullable = false)
    private Prenotazione prenotazione;

    @NotNull(message = "Il metodo di pagamento è obbligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metodo_pagamento_id", nullable = false)
    private MetodoPagamento metodoPagamento;

    @NotNull(message = "L'importo è obbligatorio")
    @DecimalMin(value = "0.0", message = "L'importo non può essere negativo")
    @Column(name = "importo", nullable = false, precision = 10, scale = 2)
    private BigDecimal importo;

    @NotNull(message = "La data di pagamento è obbligatoria")
    @CreationTimestamp
    @Column(name = "data_pagamento", nullable = false, updatable = false)
    private LocalDateTime dataPagamento;
}

