package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.ChatRoom;
import com.campusconnect.backend.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatRoomOrderBySentAtAsc(ChatRoom chatRoom);
}
