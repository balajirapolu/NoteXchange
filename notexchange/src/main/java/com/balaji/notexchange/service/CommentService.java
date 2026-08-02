package com.balaji.notexchange.service;

import com.balaji.notexchange.dto.comment.CommentRequest;
import com.balaji.notexchange.dto.comment.CommentResponse;

import java.util.List;

public interface CommentService {

    CommentResponse addComment(Long noteId, CommentRequest request);

    List<CommentResponse> getCommentsByNote(Long noteId);

    void deleteComment(Long commentId);
}
