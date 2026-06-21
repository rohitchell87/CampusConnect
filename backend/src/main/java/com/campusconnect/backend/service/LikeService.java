package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserLike;
import com.campusconnect.backend.repository.UserLikeRepository;
import com.campusconnect.backend.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {

    private final UserRepository userRepository;
    private final UserLikeRepository userLikeRepository;

    public LikeService(UserRepository userRepository, UserLikeRepository userLikeRepository) {
        this.userRepository = userRepository;
        this.userLikeRepository = userLikeRepository;
    }

    @Transactional
    public void likeUser(User sender, Long receiverId) {
        if (sender.getId().equals(receiverId)) {
            throw new RuntimeException("You cannot like yourself.");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userLikeRepository.existsBySenderAndReceiver(sender, receiver)) {
            throw new RuntimeException("User already liked.");
        }

        UserLike like = UserLike.builder()
                .sender(sender)
                .receiver(receiver)
                .build();

        userLikeRepository.save(like);
    }

    @Transactional
    public void unlikeUser(User sender, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserLike> existingLike = userLikeRepository.findBySenderAndReceiver(sender, receiver);
        if (existingLike.isPresent()) {
            userLikeRepository.delete(existingLike.get());
            return;
        }

        throw new RuntimeException("Like not found.");
    }
}
