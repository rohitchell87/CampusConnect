package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.MatchResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.MatchService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMyMatches(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<MatchResponse> matches = matchService.getMyMatches(user);
        return ResponseEntity.ok(matches);
    }
}
