package com.campusconnect.backend.exception;

public class AlreadyMatchedException extends RuntimeException {

    public AlreadyMatchedException(String message) {
        super(message);
    }
}
