package com.campusconnect.backend.dto;

import com.campusconnect.backend.entity.Gender;
import com.campusconnect.backend.entity.InterestedIn;
import com.campusconnect.backend.entity.PersonalityType;
import com.campusconnect.backend.entity.RelationshipIntent;
import com.campusconnect.backend.entity.LookingFor;
import com.campusconnect.backend.entity.SmokingHabit;
import com.campusconnect.backend.entity.DrinkingHabit;
import com.campusconnect.backend.entity.WorkoutHabit;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
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

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be at most 100")
    private Integer age;
    private Gender gender;

    @Size(max = 100, message = "Branch must be at most 100 characters")
    private String branch;

    @Min(value = 1, message = "Year must be at least 1")
    private Integer year;

    @Min(value = 100, message = "Height must be at least 100 cm")
    @Max(value = 250, message = "Height must be at most 250 cm")
    private Integer height;
    private InterestedIn interestedIn;
    private RelationshipIntent relationshipIntent;
    private WorkoutHabit workoutHabit;
    private SmokingHabit smokingHabit;
    private DrinkingHabit drinkingHabit;
    private PersonalityType personalityType;

    @Size(max = 100, message = "College must be at most 100 characters")
    private String college;

    @Size(max = 500, message = "Bio must be at most 500 characters")
    private String bio;

    @Size(max = 100, message = "Hometown must be at most 100 characters")
    private String hometown;
    private LookingFor lookingFor;
}
