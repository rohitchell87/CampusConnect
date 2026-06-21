package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.DiscoverUserResponse;
import com.campusconnect.backend.entity.Interest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.UserProfileRepository;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class UserDiscoveryService {

    private final UserProfileRepository userProfileRepository;

    public UserDiscoveryService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public List<DiscoverUserResponse> discoverUsers(User authenticatedUser) {
        UserProfile me = userProfileRepository.findByUser(authenticatedUser)
                .orElseThrow(() -> new UserNotFoundException("User profile not found"));

        List<UserProfile> others = userProfileRepository.findByUserIdNot(authenticatedUser.getId());

        return others.stream()
                .map(profile -> {
                    Set<Interest> myInterests = me.getInterests() != null ? me.getInterests() : Collections.emptySet();
                    Set<Interest> theirInterests = profile.getInterests() != null ? profile.getInterests() : Collections.emptySet();
                    int shared = (int) myInterests.stream().filter(theirInterests::contains).count();
                    return new java.util.AbstractMap.SimpleEntry<>(profile, shared);
                })
                .sorted((e1, e2) -> Integer.compare(e2.getValue(), e1.getValue()))
                .map(entry -> mapToResponse(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    private DiscoverUserResponse mapToResponse(UserProfile profile, int sharedInterests) {
        return DiscoverUserResponse.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .branch(profile.getBranch())
                .year(profile.getYear())
                .lookingFor(profile.getLookingFor())
                .profilePhoto(profile.getProfilePhoto())
                .sharedInterests(sharedInterests)
                .build();
    }
}
