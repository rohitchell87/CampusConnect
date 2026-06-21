package com.campusconnect.backend.controller;

import com.campusconnect.backend.dto.InterestResponse;
import com.campusconnect.backend.dto.UpdateInterestsRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.InterestService;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class InterestController {

    private final InterestService interestService;

    public InterestController(InterestService interestService) {
        this.interestService = interestService;
    }

    @GetMapping("/interests")
    public ResponseEntity<List<InterestResponse>> getAllInterests() {
        List<InterestResponse> response = interestService.getAllInterests();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/interests")
    public ResponseEntity<List<InterestResponse>> updateMyInterests(
            Authentication authentication,
            @Valid @RequestBody UpdateInterestsRequest request) {
        User user = (User) authentication.getPrincipal();
        List<InterestResponse> response = interestService.updateMyInterests(user, request);
        return ResponseEntity.ok(response);
    }
}
