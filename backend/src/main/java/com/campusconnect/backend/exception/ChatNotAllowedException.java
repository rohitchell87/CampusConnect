package com.campusconnect.backend.exception;

public class ChatNotAllowedException extends RuntimeException {

    public ChatNotAllowedException(String message) {
        super(message);
    }
}
