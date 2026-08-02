package com.balaji.notexchange.repository;

import com.balaji.notexchange.entity.Note;
import com.balaji.notexchange.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findBySubjectAndSemester(String subject, Integer semester);

    List<Note> findByUploader(User uploader);

    List<Note> findAllByOrderByAvgRatingDesc();

    List<Note> findBySubject(String subject);

    List<Note> findBySemester(Integer semester);
}