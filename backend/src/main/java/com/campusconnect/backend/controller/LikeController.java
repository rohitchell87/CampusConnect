package com.campusconnect.backend.controller;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.LikeService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/{receiverId}")
    public ResponseEntity<Map<String, String>> likeUser(
            Authentication authentication,
            @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        likeService.likeUser(user, receiverId);
        return ResponseEntity.ok(Map.of("message", "User liked successfully."));
    }

    @DeleteMapping("/{receiverId}")
    public ResponseEntity<Map<String, String>> unlikeUser(
            Authentication authentication,
            @PathVariable Long receiverId) {
        User user = (User) authentication.getPrincipal();
        likeService.unlikeUser(user, receiverId);
        return ResponseEntity.ok(Map.of("message", "Like removed successfully."));
    }
}
