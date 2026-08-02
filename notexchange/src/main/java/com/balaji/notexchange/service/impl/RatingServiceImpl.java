package com.balaji.notexchange.service.impl;

import com.balaji.notexchange.dto.rating.RatingRequest;
import com.balaji.notexchange.entity.Note;
import com.balaji.notexchange.entity.Rating;
import com.balaji.notexchange.entity.User;
import com.balaji.notexchange.exception.BadRequestException;
import com.balaji.notexchange.exception.ResourceNotFoundException;
import com.balaji.notexchange.repository.NoteRepository;
import com.balaji.notexchange.repository.RatingRepository;
import com.balaji.notexchange.repository.UserRepository;
import com.balaji.notexchange.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    @Override
    public void rateNote(Long noteId, RatingRequest request) {

        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        User user = getCurrentUser();

        if (ratingRepository.findByNoteAndUser(note, user).isPresent()) {
            throw new BadRequestException("You already rated this note");
        }

        Rating rating = Rating.builder()
                .note(note)
                .user(user)
                .stars(request.getStars())
                .comment(request.getComment())
                .build();

        ratingRepository.save(rating);

        double avg = ratingRepository.findByNote(note)
                .stream()
                .mapToInt(Rating::getStars)
                .average()
                .orElse(0);

        note.setAvgRating(avg);
        noteRepository.save(note);
    }
}