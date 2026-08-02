package com.balaji.notexchange.repository;

import com.balaji.notexchange.entity.Comment;
import com.balaji.notexchange.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByNoteAndParentIsNullOrderByCreatedAtAsc(Note note);

    long countByNote(Note note);
}
