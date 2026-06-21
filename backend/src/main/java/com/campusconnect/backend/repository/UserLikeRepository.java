package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserLike;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserLikeRepository extends JpaRepository<UserLike, Long> {

    Optional<UserLike> findBySenderAndReceiver(User sender, User receiver);

    boolean existsBySenderAndReceiver(User sender, User receiver);

    List<UserLike> findBySender(User sender);

    List<UserLike> findByReceiver(User receiver);
}
