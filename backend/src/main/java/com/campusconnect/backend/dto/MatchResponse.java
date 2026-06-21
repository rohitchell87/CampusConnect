package com.campusconnect.backend.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {

    private Long matchId;
    private Long userId;
    private String fullName;
    private String branch;
    private Integer year;
    private String profilePhoto;
    private LocalDateTime matchedAt;
}
