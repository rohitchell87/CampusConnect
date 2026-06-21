package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.MessageResponse;
import com.campusconnect.backend.dto.SendMessageRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.ChatService;
import jakarta.validation.Valid;
import java.util.List;
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
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @Valid @RequestBody SendMessageRequest request) {
        User user = (User) authentication.getPrincipal();
        MessageResponse response = chatService.sendMessage(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversation/{receiverId}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            Authentication authentication,
            @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        List<MessageResponse> messages = chatService.getConversation(user, receiverId);
        return ResponseEntity.ok(messages);
    }
}
