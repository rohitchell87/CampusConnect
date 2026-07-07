package com.campusconnect.backend.dto;

import com.campusconnect.backend.dto.InterestResponse;
import com.campusconnect.backend.entity.DrinkingHabit;
import com.campusconnect.backend.entity.Gender;
import com.campusconnect.backend.entity.InterestedIn;
import com.campusconnect.backend.entity.LookingFor;
import com.campusconnect.backend.entity.PersonalityType;
import com.campusconnect.backend.entity.RelationshipIntent;
import com.campusconnect.backend.entity.SmokingHabit;
import com.campusconnect.backend.entity.WorkoutHabit;
import java.util.Set;
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
public class ProfileResponse {

    private Long id;
    private String fullName;
    private Integer age;
    private Gender gender;
    private String branch;
    private Integer year;
    private Integer height;
    private InterestedIn interestedIn;
    private RelationshipIntent relationshipIntent;
    private WorkoutHabit workoutHabit;
    private SmokingHabit smokingHabit;
    private DrinkingHabit drinkingHabit;
    private PersonalityType personalityType;
    private String college;
    private String bio;
    private String hometown;
    private String profilePhoto;
    private String coverPhoto;
    private LookingFor lookingFor;
    private Set<InterestResponse> interests;
    private Boolean darkMode;
    private Boolean pushNotifications;
    private Boolean emailNotifications;
    private Boolean showOnlineStatus;
}
