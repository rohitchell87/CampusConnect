package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.MessageResponse;
import com.campusconnect.backend.dto.SendMessageRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@Tag(name = "Chat", description = "Messaging operations between matched users")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @Operation(summary = "Send a chat message")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Message sent successfully", content = @Content(schema = @Schema(implementation = MessageResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid message payload", content = @Content)
    })
    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @Valid @RequestBody SendMessageRequest request) {
        User user = (User) authentication.getPrincipal();
        logger.info("User {} sending message to receiver {}", user.getId(), request.getReceiverId());
        MessageResponse response = chatService.sendMessage(user, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get conversation with another user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conversation returned successfully", content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    })
    @GetMapping("/conversation/{receiverId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            Authentication authentication,
            @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        logger.info("Fetching conversation between user {} and receiver {}", user.getId(), receiverId);
        List<MessageResponse> messages = chatService.getConversation(user, receiverId);
        return ResponseEntity.ok(messages);
    }
}
