package com.balaji.notexchange.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private String fileUrl;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;

    private String fileName;

    private String fileType;

    @Builder.Default
    @Column(nullable = false)
    private Double avgRating = 0.0;

    @ManyToOne
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL)
    private List<Rating> ratings;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}