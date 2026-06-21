package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.ChatRoom;
import com.campusconnect.backend.entity.Match;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByMatch(Match match);
}
