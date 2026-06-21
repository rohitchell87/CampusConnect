package com.campusconnect.backend.dto;

import com.campusconnect.backend.entity.LookingFor;
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
public class DiscoverUserResponse {

    private Long id;
    private String fullName;
    private String branch;
    private Integer year;
    private LookingFor lookingFor;
    private String profilePhoto;
    private Integer sharedInterests;
}
