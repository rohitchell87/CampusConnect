package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.ProfileResponse;
import com.campusconnect.backend.dto.UpdateProfileRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.UserProfileRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public ProfileService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
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
                .bio(profile.getBio())
                .hometown(profile.getHometown())
                .profilePhoto(profile.getProfilePhoto())
                .coverPhoto(profile.getCoverPhoto())
                .lookingFor(profile.getLookingFor())
                .build();
    }
}
