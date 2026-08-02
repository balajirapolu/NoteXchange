package com.balaji.notexchange.repository;

import com.balaji.notexchange.entity.Note;
import com.balaji.notexchange.entity.Rating;
import com.balaji.notexchange.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByNoteAndUser(Note note, User user);

    List<Rating> findByNote(Note note);

    long countByNote(Note note);
}