package com.campusconnect.backend.service;
import com.campusconnect.backend.dto.MatchResponse;
import com.campusconnect.backend.entity.Match;
import com.campusconnect.backend.entity.User;
import com.campusconnect.backend.entity.UserProfile;
import com.campusconnect.backend.repository.MatchRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public List<MatchResponse> getMyMatches(User user) {
        List<Match> matches = new ArrayList<>();
        matches.addAll(matchRepository.findByUserOne(user));
        matches.addAll(matchRepository.findByUserTwo(user));

        List<MatchResponse> responses = new ArrayList<>();
        for (Match match : matches) {
            User otherUser;
            if (match.getUserOne().getId().equals(user.getId())) {
                otherUser = match.getUserTwo();
            } else {
                otherUser = match.getUserOne();
            }

            UserProfile otherUserProfile = otherUser.getProfile();
            MatchResponse response = MatchResponse.builder()
                    .matchId(match.getId())
                    .userId(otherUser.getId())
                    .fullName(otherUserProfile != null ? otherUserProfile.getFullName() : null)
                    .branch(otherUserProfile != null ? otherUserProfile.getBranch() : null)
                    .year(otherUserProfile != null ? otherUserProfile.getYear() : null)
                    .profilePhoto(otherUserProfile != null ? otherUserProfile.getProfilePhoto() : null)
                    .matchedAt(match.getMatchedAt())
                    .build();
            responses.add(response);
        }

        return responses;
    }
}
