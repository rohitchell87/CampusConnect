package com.campusconnect.backend.dto;

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
public class UpdateSettingsRequest {
    private Boolean darkMode;
    private Boolean pushNotifications;
    private Boolean emailNotifications;
    private Boolean showOnlineStatus;
}
