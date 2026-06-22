package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.ProfileResponse;
import com.campusconnect.backend.dto.UpdateProfileRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.UserProfileRepository;
import com.campusconnect.backend.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final CloudinaryService cloudinaryService;

    public ProfileService(UserRepository userRepository, UserProfileRepository userProfileRepository, CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public ProfileResponse getMyProfile(User authenticatedUser) {
        UserProfile profile = userProfileRepository.findByUser(authenticatedUser)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        return mapToResponse(profile);
    }

    public ProfileResponse updateMyProfile(User authenticatedUser, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUser(authenticatedUser)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        if (request.getFullName() != null) {
            profile.setFullName(request.getFullName());
        }
        if (request.getAge() != null) {
            profile.setAge(request.getAge());
        }
        if (request.getGender() != null) {
            profile.setGender(request.getGender());
        }
        if (request.getBranch() != null) {
            profile.setBranch(request.getBranch());
        }
        if (request.getYear() != null) {
            profile.setYear(request.getYear());
        }
        if (request.getHeight() != null) {
            profile.setHeight(request.getHeight());
        }
        if (request.getInterestedIn() != null) {
            profile.setInterestedIn(request.getInterestedIn());
        }
        if (request.getRelationshipIntent() != null) {
            profile.setRelationshipIntent(request.getRelationshipIntent());
        }
        if (request.getWorkoutHabit() != null) {
            profile.setWorkoutHabit(request.getWorkoutHabit());
        }
        if (request.getSmokingHabit() != null) {
            profile.setSmokingHabit(request.getSmokingHabit());
        }
        if (request.getDrinkingHabit() != null) {
            profile.setDrinkingHabit(request.getDrinkingHabit());
        }
        if (request.getPersonalityType() != null) {
            profile.setPersonalityType(request.getPersonalityType());
        }
        if (request.getCollege() != null) {
            profile.setCollege(request.getCollege());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getHometown() != null) {
            profile.setHometown(request.getHometown());
        }
        if (request.getLookingFor() != null) {
            profile.setLookingFor(request.getLookingFor());
        }

        UserProfile savedProfile = userProfileRepository.save(profile);
        return mapToResponse(savedProfile);
    }

    private ProfileResponse mapToResponse(UserProfile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .age(profile.getAge())
                .gender(profile.getGender())
                .branch(profile.getBranch())
                .year(profile.getYear())
                .height(profile.getHeight())
                .interestedIn(profile.getInterestedIn())
                .relationshipIntent(profile.getRelationshipIntent())
                .workoutHabit(profile.getWorkoutHabit())
                .smokingHabit(profile.getSmokingHabit())
                .drinkingHabit(profile.getDrinkingHabit())
                .personalityType(profile.getPersonalityType())
                .college(profile.getCollege())
                .bio(profile.getBio())
                .hometown(profile.getHometown())
                .profilePhoto(profile.getProfilePhoto())
                .coverPhoto(profile.getCoverPhoto())
                .lookingFor(profile.getLookingFor())
                .build();
    }

    public ProfileResponse uploadProfilePhoto(User authenticatedUser, MultipartFile file) {
        System.out.println("===== PROFILE PHOTO ENDPOINT HIT =====");
        UserProfile profile = userProfileRepository.findByUser(authenticatedUser)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        String existing = profile.getProfilePhoto();
        if (existing != null && !existing.isBlank()) {
            cloudinaryService.deleteImage(existing);
        }

        String url = cloudinaryService.uploadImage(file);
        profile.setProfilePhoto(url);
        UserProfile saved = userProfileRepository.save(profile);
        return mapToResponse(saved);
    }
}
