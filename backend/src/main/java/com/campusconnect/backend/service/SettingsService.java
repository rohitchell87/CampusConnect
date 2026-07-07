package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.SettingsResponse;
import com.campusconnect.backend.dto.UpdateSettingsRequest;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final UserRepository userRepository;

    public SettingsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public SettingsResponse getSettings(User authenticatedUser) {
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToResponse(user);
    }

    public SettingsResponse updateSettings(User authenticatedUser, UpdateSettingsRequest request) {
        User user = userRepository.findById(authenticatedUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getDarkMode() != null) {
            user.setDarkMode(request.getDarkMode());
        }
        if (request.getPushNotifications() != null) {
            user.setPushNotifications(request.getPushNotifications());
        }
        if (request.getEmailNotifications() != null) {
            user.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getShowOnlineStatus() != null) {
            user.setShowOnlineStatus(request.getShowOnlineStatus());
        }

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    private SettingsResponse mapToResponse(User user) {
        return SettingsResponse.builder()
                .darkMode(Boolean.TRUE.equals(user.getDarkMode()))
                .pushNotifications(Boolean.TRUE.equals(user.getPushNotifications()))
                .emailNotifications(Boolean.TRUE.equals(user.getEmailNotifications()))
                .showOnlineStatus(Boolean.TRUE.equals(user.getShowOnlineStatus()))
                .build();
    }
}
