package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.InterestResponse;
import com.campusconnect.backend.dto.UpdateInterestsRequest;
import com.campusconnect.backend.entity.Interest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.InterestRepository;
import com.campusconnect.backend.repository.UserProfileRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class InterestService {

    private final InterestRepository interestRepository;
    private final UserProfileRepository userProfileRepository;

    public InterestService(InterestRepository interestRepository,
                           UserProfileRepository userProfileRepository) {
        this.interestRepository = interestRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<InterestResponse> getAllInterests() {
        return interestRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InterestResponse> updateMyInterests(User authenticatedUser, UpdateInterestsRequest request) {
        UserProfile profile = userProfileRepository.findByUser(authenticatedUser)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        Set<Interest> interests = interestRepository.findAllById(request.getInterestIds()).stream()
                .collect(Collectors.toSet());

        profile.setInterests(interests);
        UserProfile savedProfile = userProfileRepository.save(profile);

        return savedProfile.getInterests().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InterestResponse mapToResponse(Interest interest) {
        return InterestResponse.builder()
                .id(interest.getId())
                .name(interest.getName())
                .icon(interest.getIcon())
                .build();
    }
}
