package com.balaji.notexchange.service;

import com.balaji.notexchange.dto.note.NoteResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.balaji.notexchange.entity.Note;

public interface NoteService {

    NoteResponse upload(String title, String subject, Integer semester, MultipartFile file);

    List<NoteResponse> getAll(String subject, Integer semester);

    NoteResponse getById(Long id);

    List<NoteResponse> getTopNotes();

    List<NoteResponse> getMyNotes();

    Note getNoteEntity(Long id);

    void deleteNote(Long id);
}