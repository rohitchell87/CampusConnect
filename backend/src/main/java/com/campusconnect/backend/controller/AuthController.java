package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.LoginRequest;
import com.campusconnect.backend.dto.LoginResponse;
import com.campusconnect.backend.dto.RegisterRequest;
import com.campusconnect.backend.dto.RegisterResponse;
import com.campusconnect.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and user session operations")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully", content = @Content(schema = @Schema(implementation = RegisterResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid registration data", content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Register request received for email={}", request.getEmail());
        RegisterResponse response = userService.register(request);
        return ResponseEntity.status(201).body(response);
    }

    @Operation(summary = "Authenticate a user and return a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful", content = @Content(schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for email={}", request.getEmail());
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get authenticated user details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Authenticated user info returned", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required", content = @Content)
    })
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> me(Authentication authentication) {
        String email = authentication.getName();
        logger.info("Authenticated user info requested for email={}", email);
        return ResponseEntity.ok(Map.of(
                "email", email,
                "message", "Authenticated successfully"
        ));
    }
}
