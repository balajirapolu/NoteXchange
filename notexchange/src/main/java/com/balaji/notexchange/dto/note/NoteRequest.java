package com.balaji.notexchange.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NoteRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotNull(message = "Semester is required")
    private Integer semester;

    @NotBlank(message = "File URL is required")
    private String fileUrl;
}