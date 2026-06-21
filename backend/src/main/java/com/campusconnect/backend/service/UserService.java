package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.RegisterRequest;
import com.campusconnect.backend.dto.RegisterResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.UserRepository;
import com.campusconnect.backend.exception.EmailAlreadyExistsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .gender(request.getGender())
                .branch(request.getBranch())
                .year(request.getYear())
                .emailVerified(false)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        return RegisterResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .message("Registration successful")
                .build();
    }
}
