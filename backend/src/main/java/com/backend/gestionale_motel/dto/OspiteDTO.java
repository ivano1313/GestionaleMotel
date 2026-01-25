package com.backend.gestionale_motel.dto;

import com.backend.gestionale_motel.entity.Sesso;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO per Ospite
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OspiteDTO {

    private Long id;

    @NotBlank(message = "Il cognome è obbligatorio")
    @Size(max = 100, message = "Il cognome non può superare i 100 caratteri")
    private String cognome;

    @NotBlank(message = "Il nome è obbligatorio")
    @Size(max = 100, message = "Il nome non può superare i 100 caratteri")
    private String nome;

    @NotNull(message = "Il sesso è obbligatorio")
    private Sesso sesso;

    @NotNull(message = "La data di nascita è obbligatoria")
    private LocalDate dataNascita;

    private Long comuneNascitaId;
    private String comuneNascitaNome;

    private Long statoNascitaId;
    private String statoNascitaNome;

    @NotNull(message = "La cittadinanza è obbligatoria")
    private Long cittadinanzaId;
    private String cittadinanzaNome;

    @NotNull(message = "Il tipo di documento è obbligatorio")
    private Long tipoDocumentoId;
    private String tipoDocumentoSigla;

    @NotBlank(message = "Il numero di documento è obbligatorio")
    @Size(max = 50, message = "Il numero di documento non può superare i 50 caratteri")
    private String numeroDocumento;

    private Long comuneRilascioId;
    private String comuneRilascioNome;

    private Long statoRilascioId;
    private String statoRilascioNome;

    @Size(max = 20, message = "Il telefono non può superare i 20 caratteri")
    private String telefono;

    @Email(message = "L'email non è valida")
    @Size(max = 100, message = "L'email non può superare i 100 caratteri")
    private String email;
}

