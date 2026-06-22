package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.DiscoverUserResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.UserDiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Discovery", description = "Search and discover other users")
public class UserDiscoveryController {

    private static final Logger logger = LoggerFactory.getLogger(UserDiscoveryController.class);

    private final UserDiscoveryService userDiscoveryService;

    public UserDiscoveryController(UserDiscoveryService userDiscoveryService) {
        this.userDiscoveryService = userDiscoveryService;
    }

    @Operation(summary = "Discover users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User discovery results returned", content = @Content(schema = @Schema(implementation = DiscoverUserResponse.class)))
    })
    @GetMapping("/discover")
    public ResponseEntity<Page<DiscoverUserResponse>> discover(Authentication authentication, Pageable pageable) {
        User user = (User) authentication.getPrincipal();
        logger.info("Discovering users for user {}", user.getId());
        Page<DiscoverUserResponse> results = userDiscoveryService.discoverUsers(user, pageable);
        return ResponseEntity.ok(results);
    }
}
