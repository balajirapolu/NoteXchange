package com.balaji.notexchange.dto.notification;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {

    private Long id;
    private String actorName;
    private String message;
    private Long noteId;
    private boolean isRead;
    private LocalDateTime createdAt;
}
