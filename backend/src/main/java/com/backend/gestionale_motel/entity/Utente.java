package com.backend.gestionale_motel.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "utente")
public class Utente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Lo username è obbligatorio")
    @Size(max = 50, message = "Lo username non può superare i 50 caratteri")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank(message = "La password è obbligatoria")
    @Size(max = 255, message = "La password non può superare i 255 caratteri")
    @Column(nullable = false, length = 255)
    private String password;

    @NotBlank(message = "Il nome è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    @Column(nullable = false, length = 100)
    private String nome;

    @Email(message = "L'email deve essere valida")
    @Size(max = 100, message = "L'email non può superare i 100 caratteri")
    @Column(length = 100)
    private String email;

    @NotNull(message = "Il ruolo è obbligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Ruolo ruolo;

    @Builder.Default
    @NotNull(message = "Lo stato attivo è obbligatorio")
    @Column(nullable = false)
    private Boolean attivo = true;

    @CreationTimestamp
    @Column(name = "data_creazione", nullable = false, updatable = false)
    private LocalDateTime dataCreazione;

    @Column(name = "ultimo_accesso")
    private LocalDateTime ultimoAccesso;
}