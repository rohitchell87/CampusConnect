package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.MatchResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.MatchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matches", description = "Retrieve matches for the current user")
public class MatchController {

    private static final Logger logger = LoggerFactory.getLogger(MatchController.class);
    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @Operation(summary = "Get current user matches")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Matches returned successfully", content = @Content(schema = @Schema(implementation = MatchResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMyMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        logger.info("Fetching matches for user {}", user.getId());
        List<MatchResponse> matches = matchService.getMyMatches(user);
        return ResponseEntity.ok(matches);
    }
}
