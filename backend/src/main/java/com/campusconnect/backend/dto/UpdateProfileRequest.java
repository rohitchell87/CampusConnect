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
public class UpdateProfileRequest {

    private String fullName;
    private Integer age;
    private String gender;
    private String branch;
    private Integer year;
    private String bio;
    private String hometown;
    private LookingFor lookingFor;
}
