package com.balaji.notexchange.dto.note;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoteResponse {

    private Long id;

    private String title;

    private String subject;

    private Integer semester;

    private String fileUrl;

    private Double avgRating;

    private String uploaderName;
}