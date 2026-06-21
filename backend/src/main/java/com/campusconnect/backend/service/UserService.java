package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.LoginRequest;
import com.campusconnect.backend.dto.LoginResponse;
import com.campusconnect.backend.dto.RegisterRequest;
import com.campusconnect.backend.dto.RegisterResponse;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.exception.AccountDisabledException;
import com.campusconnect.backend.exception.EmailAlreadyExistsException;
import com.campusconnect.backend.exception.InvalidCredentialsException;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
