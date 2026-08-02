package com.balaji.notexchange.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CommentResponse {

    private Long id;
    private String content;
    private Long noteId;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long parentId;
    private LocalDateTime createdAt;
    private List<CommentResponse> replies;
}
