package com.campusconnect.backend.security;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.repository.UserProfileRepository;
import com.campusconnect.backend.repository.UserRepository;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public CustomOAuth2UserService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);

        Map<String, Object> attrs = oauth2User.getAttributes();
        String email = (String) attrs.get("email");
        String name = (String) attrs.getOrDefault("name", attrs.getOrDefault("given_name", ""));
        String picture = (String) attrs.getOrDefault("picture", "");
        Boolean emailVerified = Boolean.TRUE.equals(attrs.get("email_verified")) || Boolean.TRUE.equals(attrs.get("verified_email"));

        if (email == null || email.isEmpty()) {
            logger.warn("OAuth2 user without email: {}", attrs);
            return oauth2User;
        }

        userRepository.findByEmail(email).ifPresentOrElse(u -> {
            // Existing user - nothing to do here for now
            logger.debug("Existing user logged in via OAuth2: {}", email);
        }, () -> {
            // Create a new user and profile
            User user = User.builder()
                    .email(email)
                    .password("")
                    .emailVerified(true)
                    .enabled(true)
                    .build();
            User saved = userRepository.save(user);

            UserProfile profile = UserProfile.builder()
                    .fullName(name)
                    .profilePhoto(picture)
                    .user(saved)
                    .build();
            userProfileRepository.save(profile);

            logger.info("Created new user from OAuth2 login: {}", email);
        });

        return oauth2User;
    }
}
