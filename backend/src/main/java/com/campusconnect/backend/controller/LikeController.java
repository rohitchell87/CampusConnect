package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
@Tag(name = "Likes", description = "Like and unlike operations for users")
public class LikeController {

    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @Operation(summary = "Like a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User liked successfully", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Receiver not found", content = @Content)
    })
    @PostMapping("/{receiverId}")
    public ResponseEntity<Map<String, String>> likeUser(
            Authentication authentication,
            @Parameter(description = "ID of the user to like", required = true) @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        logger.info("User {} liked user {}", user.getId(), receiverId);
        likeService.likeUser(user, receiverId);
        return ResponseEntity.ok(Map.of("message", "User liked successfully."));
    }

    @Operation(summary = "Remove a like from a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Like removed successfully", content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Receiver not found", content = @Content)
    })
    @DeleteMapping("/{receiverId}")
    public ResponseEntity<Map<String, String>> unlikeUser(
            Authentication authentication,
            @Parameter(description = "ID of the user to unlike", required = true) @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        logger.info("User {} unliked user {}", user.getId(), receiverId);
        likeService.unlikeUser(user, receiverId);
        return ResponseEntity.ok(Map.of("message", "Like removed successfully."));
    }
}
