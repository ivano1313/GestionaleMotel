package com.backend.gestionale_motel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "ospite",
    indexes = {
        @Index(name = "idx_ospite_cognome_nome", columnList = "cognome, nome"),
        @Index(name = "idx_ospite_numero_documento", columnList = "numero_documento")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ospite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==================== Dati anagrafici ====================

    @NotBlank(message = "Il cognome è obbligatorio")
    @Size(max = 100, message = "Il cognome non può superare i 100 caratteri")
    @Column(name = "cognome", nullable = false, length = 100)
    private String cognome;

    @NotBlank(message = "Il nome è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @NotNull(message = "Il sesso è obbligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "sesso", nullable = false, length = 1)
    private Sesso sesso;

    @NotNull(message = "La data di nascita è obbligatoria")
    @Column(name = "data_nascita", nullable = false)
    private LocalDate dataNascita;

    // ==================== Luogo nascita (XOR: italiano o estero) ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comune_nascita_id")
    private Comune comuneNascita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stato_nascita_id")
    private Stato statoNascita;

    // ==================== Cittadinanza ====================

    @NotNull(message = "La cittadinanza è obbligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cittadinanza_id", nullable = false)
    private Stato cittadinanza;

    // ==================== Documento ====================

    @NotNull(message = "Il tipo di documento è obbligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_documento_id", nullable = false)
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "Il numero di documento è obbligatorio")
    @Size(max = 20, message = "Il numero di documento non può superare i 20 caratteri")
    @Column(name = "numero_documento", nullable = false, length = 20)
    private String numeroDocumento;

    // ==================== Luogo rilascio documento (XOR: italiano o estero) ====================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comune_rilascio_id")
    private Comune comuneRilascio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stato_rilascio_id")
    private Stato statoRilascio;

    // ==================== Contatti (opzionali) ====================

    @Size(max = 20, message = "Il telefono non può superare i 20 caratteri")
    @Column(name = "telefono", length = 20)
    private String telefono;

    @Email(message = "L'email deve essere valida")
    @Size(max = 100, message = "L'email non può superare i 100 caratteri")
    @Column(name = "email", length = 100)
    private String email;

    // ==================== Audit ====================

    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(name = "attivo", nullable = false)
    @Builder.Default
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;
}

