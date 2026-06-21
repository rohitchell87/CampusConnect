package com.campusconnect.backend.repository;

import com.campusconnect.backend.entity.Match;
import com.campusconnect.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByUserOneAndUserTwo(User userOne, User userTwo);

    boolean existsByUserOneAndUserTwo(User userOne, User userTwo);

    List<Match> findByUserOne(User userOne);

    List<Match> findByUserTwo(User userTwo);
}
