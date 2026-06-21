package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.DiscoverUserResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.UserDiscoveryService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserDiscoveryController {

    private final UserDiscoveryService userDiscoveryService;

    public UserDiscoveryController(UserDiscoveryService userDiscoveryService) {
        this.userDiscoveryService = userDiscoveryService;
    }

    @GetMapping("/discover")
    public ResponseEntity<List<DiscoverUserResponse>> discover(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<DiscoverUserResponse> results = userDiscoveryService.discoverUsers(user);
        return ResponseEntity.ok(results);
    }
}
