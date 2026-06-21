package com.campusconnect.backend.service;

import com.campusconnect.backend.entity.Match;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserLike;
import com.campusconnect.backend.repository.MatchRepository;
import com.campusconnect.backend.repository.UserLikeRepository;
import com.campusconnect.backend.repository.UserRepository;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {

    private final UserRepository userRepository;
    private final UserLikeRepository userLikeRepository;
    private final MatchRepository matchRepository;

    public LikeService(UserRepository userRepository, UserLikeRepository userLikeRepository,
                       MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.userLikeRepository = userLikeRepository;
        this.matchRepository = matchRepository;
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

        if (userLikeRepository.existsBySenderAndReceiver(receiver, sender)) {
            User userOne;
            User userTwo;
            if (sender.getId() < receiver.getId()) {
                userOne = sender;
                userTwo = receiver;
            } else {
                userOne = receiver;
                userTwo = sender;
            }

            if (!matchRepository.existsByUserOneAndUserTwo(userOne, userTwo)) {
                Match match = Match.builder()
                        .userOne(userOne)
                        .userTwo(userTwo)
                        .build();
                matchRepository.save(match);
            }
        }
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
