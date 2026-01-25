package com.backend.gestionale_motel.exception;

/**
 * Eccezione lanciata per violazioni di regole business
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}

