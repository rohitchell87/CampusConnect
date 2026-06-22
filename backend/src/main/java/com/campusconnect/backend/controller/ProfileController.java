package com.campusconnect.backend.controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.campusconnect.backend.dto.ProfileResponse;
import com.campusconnect.backend.dto.UpdateProfileRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        ProfileResponse response = profileService.getMyProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = (User) authentication.getPrincipal();
        ProfileResponse response = profileService.updateMyProfile(user, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<ProfileResponse> uploadProfilePhoto(Authentication authentication,
                                                          @RequestParam("file") MultipartFile file) {

    System.out.println("===== UPLOAD ENDPOINT HIT =====");

    User user = (User) authentication.getPrincipal();
    ProfileResponse response = profileService.uploadProfilePhoto(user, file);
    return ResponseEntity.ok(response);
}
}
