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
public class SettingsResponse {
    private boolean darkMode;
    private boolean pushNotifications;
    private boolean emailNotifications;
    private boolean showOnlineStatus;
}
