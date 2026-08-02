package com.balaji.notexchange.service;

import com.balaji.notexchange.dto.rating.RatingRequest;

public interface RatingService {

    void rateNote(Long noteId, RatingRequest request);

}