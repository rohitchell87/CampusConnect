package com.campusconnect.backend.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccountDisabledException.class)
    public ResponseEntity<Map<String, Object>> handleAccountDisabled(AccountDisabledException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFound(UserNotFoundException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AlreadyLikedException.class)
    public ResponseEntity<Map<String, Object>> handleAlreadyLiked(AlreadyLikedException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AlreadyMatchedException.class)
    public ResponseEntity<Map<String, Object>> handleAlreadyMatched(AlreadyMatchedException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ChatNotAllowedException.class)
    public ResponseEntity<Map<String, Object>> handleChatNotAllowed(ChatNotAllowedException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ConversationNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleConversationNotFound(ConversationNotFoundException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InterestNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleInterestNotFound(InterestNotFoundException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MessageNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleMessageNotFound(MessageNotFoundException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ImageUploadException.class)
    public ResponseEntity<Map<String, Object>> handleImageUploadException(ImageUploadException ex) {
        return buildResponseBody(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        Map<String, String> errors = new LinkedHashMap<>();

        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
        for (FieldError error : fieldErrors) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        body.put("message", "Validation failed");
        body.put("errors", errors);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    private ResponseEntity<Map<String, Object>> buildResponseBody(String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        return ResponseEntity.status(status).body(body);
    }
}
