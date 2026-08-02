package com.balaji.notexchange.service.impl;

import com.balaji.notexchange.dto.comment.CommentRequest;
import com.balaji.notexchange.dto.comment.CommentResponse;
import com.balaji.notexchange.entity.Comment;
import com.balaji.notexchange.entity.Note;
import com.balaji.notexchange.entity.User;
import com.balaji.notexchange.exception.BadRequestException;
import com.balaji.notexchange.exception.ResourceNotFoundException;
import com.balaji.notexchange.repository.CommentRepository;
import com.balaji.notexchange.repository.NoteRepository;
import com.balaji.notexchange.repository.UserRepository;
import com.balaji.notexchange.service.CommentService;
import com.balaji.notexchange.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public CommentResponse addComment(Long noteId, CommentRequest request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        User actor = getCurrentUser();

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));

            if (!parent.getNote().getId().equals(noteId)) {
                throw new BadRequestException("Parent comment does not belong to this note");
            }
        }

        Comment comment = Comment.builder()
                .content(request.getContent())
                .note(note)
                .user(actor)
                .parent(parent)
                .build();

        comment = commentRepository.save(comment);

        // --- Notification Logic ---
        if (parent == null) {
            // Top-level doubt: Notify the note uploader (if they are not the one commenting)
            User noteOwner = note.getUploader();
            if (noteOwner != null && !noteOwner.getId().equals(actor.getId())) {
                notificationService.createNotification(
                        noteOwner,
                        actor.getName(),
                        actor.getName() + " asked a doubt on your note \"" + note.getTitle() + "\"",
                        note.getId()
                );
            }
        } else {
            // Reply: Notify the parent comment author (if they are not the one replying)
            User parentAuthor = parent.getUser();
            if (parentAuthor != null && !parentAuthor.getId().equals(actor.getId())) {
                notificationService.createNotification(
                        parentAuthor,
                        actor.getName(),
                        actor.getName() + " replied to your doubt on \"" + note.getTitle() + "\"",
                        note.getId()
                );
            }
        }

        return mapToResponse(comment);
    }

    @Override
    public List<CommentResponse> getCommentsByNote(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        List<Comment> topLevelComments = commentRepository.findByNoteAndParentIsNullOrderByCreatedAtAsc(note);

        return topLevelComments.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteComment(Long commentId) {
        User user = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private CommentResponse mapToResponse(Comment comment) {
        List<CommentResponse> replyResponses = new ArrayList<>();
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            replyResponses = comment.getReplies().stream()
                    .map(this::mapToResponse)
                    .toList();
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .noteId(comment.getNote().getId())
                .userId(comment.getUser().getId())
                .userName(comment.getUser().getName())
                .userEmail(comment.getUser().getEmail())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt())
                .replies(replyResponses)
                .build();
    }
}
