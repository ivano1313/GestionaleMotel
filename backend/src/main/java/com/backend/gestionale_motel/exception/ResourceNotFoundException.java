package com.backend.gestionale_motel.exception;

/**
 * Eccezione lanciata quando una risorsa non viene trovata
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " non trovato con id: " + id);
    }
}

