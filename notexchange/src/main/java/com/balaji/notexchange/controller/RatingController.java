package com.balaji.notexchange.controller;

import com.balaji.notexchange.dto.rating.RatingRequest;
import com.balaji.notexchange.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/{id}/rate")
    public ResponseEntity<String> rateNote(
            @PathVariable Long id,
            @Valid @RequestBody RatingRequest request) {

        ratingService.rateNote(id, request);

        return ResponseEntity.ok("Rating submitted successfully");
    }
}