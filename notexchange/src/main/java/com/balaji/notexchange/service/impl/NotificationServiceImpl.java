package com.balaji.notexchange.service.impl;

import com.balaji.notexchange.dto.notification.NotificationResponse;
import com.balaji.notexchange.entity.Notification;
import com.balaji.notexchange.entity.User;
import com.balaji.notexchange.exception.BadRequestException;
import com.balaji.notexchange.exception.ResourceNotFoundException;
import com.balaji.notexchange.repository.NotificationRepository;
import com.balaji.notexchange.repository.UserRepository;
import com.balaji.notexchange.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public void createNotification(User recipient, String actorName, String message, Long noteId) {
        // Don't notify a user about their own actions
        if (recipient == null) return;

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actorName(actorName)
                .message(message)
                .noteId(noteId)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getUserNotifications() {
        User user = getCurrentUser();
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public long getUnreadCount() {
        User user = getCurrentUser();
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    @Override
    public void markAsRead(Long notificationId) {
        User user = getCurrentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new BadRequestException("Access denied");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead() {
        User user = getCurrentUser();
        List<Notification> unread = notificationRepository.findByRecipientOrderByCreatedAtDesc(user)
                .stream()
                .filter(n -> !n.isRead())
                .toList();

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .actorName(notification.getActorName())
                .message(notification.getMessage())
                .noteId(notification.getNoteId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
