package com.backend.gestionale_motel.exception;

import com.backend.gestionale_motel.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Gestore globale delle eccezioni per tutti i controller REST.
 *
 * SICUREZZA: I messaggi di errore vengono tradotti in italiano user-friendly.
 * I dettagli tecnici vengono loggati solo lato server, mai esposti all'utente.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Gestisce ResourceNotFoundException (404 Not Found)
     * Lanciata quando una risorsa richiesta non esiste
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Gestisce BusinessException (400 Bad Request)
     * Lanciata per violazioni di regole di business
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Gestisce IllegalArgumentException (400 Bad Request)
     * Lanciata per argomenti non validi
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Gestisce IllegalStateException (409 Conflict)
     * Lanciata quando lo stato dell'applicazione non permette l'operazione
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex,
            HttpServletRequest request) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message(ex.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Gestisce MethodArgumentNotValidException (400 Bad Request)
     * Lanciata quando la validazione Jakarta Bean Validation fallisce
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        String message = "Errore di validazione: " + errors;

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Error")
                .message(message)
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Gestisce DataIntegrityViolationException (409 Conflict)
     * Errori di vincoli database: UNIQUE, FOREIGN KEY, NOT NULL, ecc.
     * Traduce i messaggi tecnici in messaggi user-friendly in italiano.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        // Log dettagli tecnici per debug (solo lato server)
        log.error("Violazione integrità dati - Path: {} - Dettaglio: {}",
                request.getRequestURI(), ex.getMostSpecificCause().getMessage());

        String messaggioUtente = traduciErroreDatabase(ex);

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error("Conflitto dati")
                .message(messaggioUtente)
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Gestisce tutte le altre eccezioni non gestite (500 Internal Server Error)
     * SICUREZZA: Non espone mai dettagli tecnici all'utente.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        // Log dettagli tecnici per debug (solo lato server)
        log.error("Errore interno - Path: {} - Tipo: {} - Messaggio: {}",
                request.getRequestURI(), ex.getClass().getSimpleName(), ex.getMessage(), ex);

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("Si è verificato un errore interno del server. Contattare l'assistenza se il problema persiste.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    /**
     * Traduce gli errori di database in messaggi user-friendly in italiano.
     * Analizza il messaggio di errore e restituisce una descrizione comprensibile.
     */
    private String traduciErroreDatabase(DataIntegrityViolationException ex) {
        String messaggioOriginale = ex.getMostSpecificCause().getMessage().toLowerCase();

        // Errori di duplicazione (UNIQUE constraint)
        if (messaggioOriginale.contains("duplicate entry")) {
            if (messaggioOriginale.contains("camera") && messaggioOriginale.contains("numero")) {
                return "Esiste già una camera con questo numero.";
            }
            if (messaggioOriginale.contains("tipologia") && messaggioOriginale.contains("nome")) {
                return "Esiste già una tipologia camera con questo nome.";
            }
            if (messaggioOriginale.contains("utente") && messaggioOriginale.contains("username")) {
                return "Esiste già un utente con questo username.";
            }
            if (messaggioOriginale.contains("metodo_pagamento") && messaggioOriginale.contains("nome")) {
                return "Esiste già un metodo di pagamento con questo nome.";
            }
            if (messaggioOriginale.contains("tipo_documento") && messaggioOriginale.contains("sigla")) {
                return "Esiste già un tipo documento con questa sigla.";
            }
            if (messaggioOriginale.contains("stato") && messaggioOriginale.contains("codice")) {
                return "Esiste già uno stato con questo codice.";
            }
            if (messaggioOriginale.contains("stato") && messaggioOriginale.contains("nome")) {
                return "Esiste già uno stato con questo nome.";
            }
            if (messaggioOriginale.contains("comune") && messaggioOriginale.contains("codice")) {
                return "Esiste già un comune con questo codice.";
            }
            if (messaggioOriginale.contains("tariffa") && messaggioOriginale.contains("tipologia") && messaggioOriginale.contains("periodo")) {
                return "Esiste già una tariffa per questa combinazione di tipologia camera e periodo.";
            }
            if (messaggioOriginale.contains("ospite_prenotazione")) {
                return "Questo ospite è già associato a questa prenotazione.";
            }
            // Fallback generico per duplicati
            return "Esiste già un record con questi dati. Verificare i campi inseriti.";
        }

        // Errori di foreign key (impossibile eliminare)
        if (messaggioOriginale.contains("foreign key") || messaggioOriginale.contains("cannot delete")) {
            if (messaggioOriginale.contains("camera")) {
                return "Impossibile eliminare: esistono prenotazioni associate a questa camera.";
            }
            if (messaggioOriginale.contains("tipologia")) {
                return "Impossibile eliminare: esistono camere o tariffe associate a questa tipologia.";
            }
            if (messaggioOriginale.contains("periodo")) {
                return "Impossibile eliminare: esistono tariffe associate a questo periodo.";
            }
            if (messaggioOriginale.contains("ospite")) {
                return "Impossibile eliminare: questo ospite è associato a delle prenotazioni.";
            }
            if (messaggioOriginale.contains("prenotazione")) {
                return "Impossibile eliminare: esistono pagamenti o ospiti associati a questa prenotazione.";
            }
            if (messaggioOriginale.contains("metodo_pagamento")) {
                return "Impossibile eliminare: esistono pagamenti che utilizzano questo metodo.";
            }
            // Fallback generico per foreign key
            return "Impossibile completare l'operazione: esistono dati collegati che dipendono da questo record.";
        }

        // Errori di campo obbligatorio (NOT NULL)
        if (messaggioOriginale.contains("cannot be null") || messaggioOriginale.contains("not null")) {
            return "Compilare tutti i campi obbligatori.";
        }

        // Fallback generico
        return "Operazione non consentita: verificare i dati inseriti.";
    }
}
