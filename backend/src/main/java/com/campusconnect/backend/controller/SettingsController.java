package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.SettingsResponse;
import com.campusconnect.backend.dto.UpdateSettingsRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.SettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "User preference settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    @Operation(summary = "Get current user settings")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Settings retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Authentication required")
    })
    public ResponseEntity<SettingsResponse> getSettings(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(settingsService.getSettings(user));
    }

    @PutMapping
    @Operation(summary = "Update current user settings")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Settings updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid settings payload")
    })
    public ResponseEntity<SettingsResponse> updateSettings(Authentication authentication,
                                                           @Valid @RequestBody UpdateSettingsRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(settingsService.updateSettings(user, request));
    }
}
