package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.DiscoverUserResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.UserDiscoveryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ResponseEntity<Page<DiscoverUserResponse>> discover(Authentication authentication, Pageable pageable) {
        User user = (User) authentication.getPrincipal();
        Page<DiscoverUserResponse> results = userDiscoveryService.discoverUsers(user, pageable);
        return ResponseEntity.ok(results);
    }
}
