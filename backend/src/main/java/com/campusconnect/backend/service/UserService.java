package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.LoginRequest;
import com.campusconnect.backend.dto.LoginResponse;
import com.campusconnect.backend.dto.RegisterRequest;
import com.campusconnect.backend.dto.RegisterResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.exception.AccountDisabledException;
import com.campusconnect.backend.exception.EmailAlreadyExistsException;
import com.campusconnect.backend.exception.InvalidCredentialsException;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.UserProfileRepository;
import com.campusconnect.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,
                       UserProfileRepository userProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        UserProfile profile = UserProfile.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .branch(request.getBranch())
                .year(request.getYear())
                .user(savedUser)
                .build();

        userProfileRepository.save(profile);

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(profile.getFullName())
                .email(savedUser.getEmail())
                .message("Registration successful")
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new AccountDisabledException("Account is disabled");
        }

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .message("Login successful")
                .fullName(user.getProfile() != null ? user.getProfile().getFullName() : null)
                .email(user.getEmail())
                .build();
    }

    public String requestPasswordReset(String email) {
        boolean exists = userRepository.existsByEmail(email);
        if (exists) {
            logger.info("Password reset requested for email={}", email);
            // TODO: integrate a real email service here to send a reset link.
        } else {
            logger.info("Password reset request for unknown email={}", email);
        }
        return "If that email exists in our system, a password reset link has been sent.";
    }
}
