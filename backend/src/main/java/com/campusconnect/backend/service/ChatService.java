package com.campusconnect.backend.service;

import com.campusconnect.backend.dto.MessageResponse;
import com.campusconnect.backend.dto.SendMessageRequest;
import com.campusconnect.backend.entity.ChatRoom;
import com.campusconnect.backend.entity.Match;
import com.campusconnect.backend.entity.Message;
import com.campusconnect.backend.entity.Notification;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.exception.ChatNotAllowedException;
import com.campusconnect.backend.exception.UserNotFoundException;
import com.campusconnect.backend.repository.ChatRoomRepository;
import com.campusconnect.backend.repository.MatchRepository;
import com.campusconnect.backend.repository.MessageRepository;
import com.campusconnect.backend.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService {

    private final MatchRepository matchRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ChatService(MatchRepository matchRepository, ChatRoomRepository chatRoomRepository,
                       MessageRepository messageRepository, UserRepository userRepository,
                       NotificationService notificationService) {
        this.matchRepository = matchRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public MessageResponse sendMessage(User sender, SendMessageRequest request) {
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Match> match = matchRepository.findByUserOneAndUserTwo(sender, receiver);
        if (match.isEmpty()) {
            match = matchRepository.findByUserOneAndUserTwo(receiver, sender);
        }

        if (match.isEmpty()) {
            throw new ChatNotAllowedException("Users are not matched.");
        }

        final Match finalMatch = match.get();
        ChatRoom chatRoom = chatRoomRepository.findByMatch(finalMatch)
                .orElseGet(() -> {
                    ChatRoom newChatRoom = ChatRoom.builder()
                            .match(finalMatch)
                            .build();
                    return chatRoomRepository.save(newChatRoom);
                });

        Message message = Message.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(request.getContent())
                .build();

        Message savedMessage = messageRepository.save(message);

        notificationService.createNotification(
                receiver,
                sender,
                Notification.NotificationType.MESSAGE,
                "New Message 💬",
                String.format("%s sent you a message.", resolveDisplayName(sender))
        );

        return MessageResponse.builder()
                .id(savedMessage.getId())
                .senderId(savedMessage.getSender().getId())
                .senderName(sender.getProfile() != null ? sender.getProfile().getFullName() : null)
                .content(savedMessage.getContent())
                .isRead(savedMessage.getIsRead())
                .sentAt(savedMessage.getSentAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(User user, Long receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Match> match = matchRepository.findByUserOneAndUserTwo(user, receiver);
        if (match.isEmpty()) {
            match = matchRepository.findByUserOneAndUserTwo(receiver, user);
        }

        if (match.isEmpty()) {
            throw new ChatNotAllowedException("Users are not matched.");
        }

        Optional<ChatRoom> chatRoom = chatRoomRepository.findByMatch(match.get());
        if (chatRoom.isEmpty()) {
            return new ArrayList<>();
        }

        List<Message> messages = messageRepository.findByChatRoomOrderBySentAtAsc(chatRoom.get());
        List<MessageResponse> responses = new ArrayList<>();

        for (Message message : messages) {
            MessageResponse response = MessageResponse.builder()
                    .id(message.getId())
                    .senderId(message.getSender().getId())
                    .senderName(message.getSender().getProfile() != null ? message.getSender().getProfile().getFullName() : null)
                    .content(message.getContent())
                    .isRead(message.getIsRead())
                    .sentAt(message.getSentAt())
                    .build();
            responses.add(response);
        }

        return responses;
    }

    private String resolveDisplayName(User user) {
        if (user.getProfile() != null && user.getProfile().getFullName() != null
                && !user.getProfile().getFullName().isBlank()) {
            return user.getProfile().getFullName();
        }
        return user.getEmail() != null ? user.getEmail() : "someone";
    }
}
