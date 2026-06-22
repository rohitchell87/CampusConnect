package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.InterestResponse;
import com.campusconnect.backend.dto.UpdateInterestsRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.InterestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "Interests", description = "Interest catalog and user interest updates")
public class InterestController {

    private static final Logger logger = LoggerFactory.getLogger(InterestController.class);

    private final InterestService interestService;

    public InterestController(InterestService interestService) {
        this.interestService = interestService;
    }

    @Operation(summary = "List all available interests")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of interests returned", content = @Content(schema = @Schema(implementation = InterestResponse.class)))
    })
    @GetMapping("/interests")
    public ResponseEntity<List<InterestResponse>> getAllInterests() {
        logger.info("Fetching all interests");
        List<InterestResponse> response = interestService.getAllInterests();
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Update current user's interests")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Interests updated successfully", content = @Content(schema = @Schema(implementation = InterestResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid interests payload", content = @Content)
    })
    @PutMapping("/profile/interests")
    public ResponseEntity<List<InterestResponse>> updateMyInterests(
            Authentication authentication,
            @Valid @RequestBody UpdateInterestsRequest request) {
        User user = (User) authentication.getPrincipal();
        logger.info("Updating interests for user {}", user.getId());
        List<InterestResponse> response = interestService.updateMyInterests(user, request);
        return ResponseEntity.ok(response);
    }
}
