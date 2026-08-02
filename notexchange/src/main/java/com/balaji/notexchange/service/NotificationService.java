package com.balaji.notexchange.service;

import com.balaji.notexchange.dto.notification.NotificationResponse;
import com.balaji.notexchange.entity.User;

import java.util.List;

public interface NotificationService {

    void createNotification(User recipient, String actorName, String message, Long noteId);

    List<NotificationResponse> getUserNotifications();

    long getUnreadCount();

    void markAsRead(Long notificationId);

    void markAllAsRead();
}
