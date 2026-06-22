package com.campusconnect.backend.controller;
import com.campusconnect.backend.dto.ProfileResponse;
import com.campusconnect.backend.dto.UpdateProfileRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "Profile", description = "User profile management endpoints")
public class ProfileController {

    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile returned successfully", content = @Content(schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required", content = @Content)
    })
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        logger.info("Retrieving profile for user {}", user.getId());
        ProfileResponse response = profileService.getMyProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully", content = @Content(schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid profile data", content = @Content)
    })
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = (User) authentication.getPrincipal();
        logger.info("Updating profile for user {}", user.getId());
        ProfileResponse response = profileService.updateMyProfile(user, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload or replace the current user's profile photo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile photo uploaded successfully", content = @Content(schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid image upload", content = @Content)
    })
    public ResponseEntity<ProfileResponse> uploadProfilePhoto(Authentication authentication,
                                                              @RequestParam("file") MultipartFile file) {

        User user = (User) authentication.getPrincipal();
        logger.info("Uploading profile photo for user {}", user.getId());
        ProfileResponse response = profileService.uploadProfilePhoto(user, file);
        return ResponseEntity.ok(response);
    }

    @PutMapping(path = "/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload or replace the current user's cover photo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cover photo uploaded successfully", content = @Content(schema = @Schema(implementation = ProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid image upload", content = @Content)
    })
    public ResponseEntity<ProfileResponse> uploadCoverPhoto(Authentication authentication,
                                                            @RequestParam("file") MultipartFile file) {

        User user = (User) authentication.getPrincipal();
        logger.info("Uploading cover photo for user {}", user.getId());
        ProfileResponse response = profileService.uploadCoverPhoto(user, file);
        return ResponseEntity.ok(response);
    }
}
