package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUser(User user);

    Page<UserProfile> findByUserIdNot(Long userId, Pageable pageable);
}
