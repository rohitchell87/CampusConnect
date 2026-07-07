package com.campusconnect.backend.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.campusconnect.backend.entity.Notification.NotificationType;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.repository.MatchRepository;
import com.campusconnect.backend.repository.UserLikeRepository;
import com.campusconnect.backend.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LikeServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserLikeRepository userLikeRepository;

    @Mock
    private MatchRepository matchRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private LikeService likeService;

    @Test
    void likeUserCreatesLikeAndMatchNotificationsWhenMutualLikeCreatesMatch() {
        User sender = User.builder().id(1L).email("sender@example.com").build();
        User receiver = User.builder().id(2L).email("receiver@example.com").build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(userLikeRepository.existsBySenderAndReceiver(sender, receiver)).thenReturn(false);
        when(userLikeRepository.existsBySenderAndReceiver(receiver, sender)).thenReturn(true);
        when(matchRepository.existsByUserOneAndUserTwo(any(), any())).thenReturn(false);

        likeService.likeUser(sender, 2L);

        verify(notificationService).createNotification(
                eq(receiver),
                eq(sender),
                eq(NotificationType.LIKE),
                eq("New Like ❤️"),
                eq("sender@example.com liked your profile.")
        );

        verify(notificationService).createNotification(
                eq(sender),
                eq(receiver),
                eq(NotificationType.MATCH),
                eq("It's a Match! 🎉"),
                eq("You and receiver@example.com liked each other.")
        );

        verify(notificationService).createNotification(
                eq(receiver),
                eq(sender),
                eq(NotificationType.MATCH),
                eq("It's a Match! 🎉"),
                eq("You and sender@example.com liked each other.")
        );
    }
}
