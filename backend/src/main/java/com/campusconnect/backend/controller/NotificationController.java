package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.NotificationResponse;
import com.campusconnect.backend.entity.Notification;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User notification operations")
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Operation(summary = "Get all notifications for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notifications retrieved successfully", content = @Content(schema = @Schema(implementation = NotificationResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        logger.info("Fetching notifications for user {}", user.getId());
        
        List<Notification> notifications = notificationService.getNotificationsForUser(user);
        List<NotificationResponse> responses = notifications.stream()
                .map(this::mapToResponse)
                .toList();
        
        return ResponseEntity.ok(responses);
    }

    @Operation(summary = "Mark a specific notification as read")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Notification marked as read", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            Authentication authentication,
            @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        logger.info("User {} marking notification {} as read", user.getId(), id);
        
        notificationService.markAsRead(id);
        
        return ResponseEntity.ok(Map.of("message", "Notification marked as read."));
    }

    @Operation(summary = "Mark all notifications as read for the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All notifications marked as read", content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        logger.info("User {} marking all notifications as read", user.getId());
        
        notificationService.markAllAsRead(user);
        
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read."));
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .actorId(notification.getActor().getId())
                .actorName(notification.getActor().getProfile() != null ? notification.getActor().getProfile().getFullName() : null)
                .actorProfilePhoto(notification.getActor().getProfile() != null ? notification.getActor().getProfile().getProfilePhoto() : null)
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
