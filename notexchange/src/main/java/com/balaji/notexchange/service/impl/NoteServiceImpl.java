package com.balaji.notexchange.service.impl;

import com.balaji.notexchange.dto.note.NoteResponse;
import com.balaji.notexchange.entity.Note;
import com.balaji.notexchange.entity.User;
import com.balaji.notexchange.exception.ResourceNotFoundException;
import com.balaji.notexchange.repository.NoteRepository;
import com.balaji.notexchange.repository.UserRepository;
import com.balaji.notexchange.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import com.balaji.notexchange.exception.BadRequestException;

@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

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
    public NoteResponse upload(String title, String subject, Integer semester, MultipartFile file) {

        User user = getCurrentUser();

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("File read failed", e);
        }

        Note note = Note.builder()
                .title(title)
                .subject(subject)
                .semester(semester)
                .fileData(bytes)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileUrl("")
                .avgRating(0.0)
                .uploader(user)
                .build();

        note = noteRepository.save(note);
        
        // Point fileUrl directly to local MySQL streaming endpoint
        String fileUrl = "http://localhost:8080/api/notes/" + note.getId() + "/file";
        note.setFileUrl(fileUrl);
        note = noteRepository.save(note);

        return map(note);
    }

    @Override
    public List<NoteResponse> getAll(String subject, Integer semester) {

        List<Note> notes;

        if (subject != null && semester != null) {
            notes = noteRepository.findBySubjectAndSemester(subject, semester);
        } else if (subject != null) {
            notes = noteRepository.findBySubject(subject);
        } else if (semester != null) {
            notes = noteRepository.findBySemester(semester);
        } else {
            notes = noteRepository.findAll();
        }

        return notes.stream().map(this::map).toList();
    }

    @Override
    public NoteResponse getById(Long id) {

        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        return map(note);
    }

    @Override
    public List<NoteResponse> getTopNotes() {

        return noteRepository.findAllByOrderByAvgRatingDesc()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public List<NoteResponse> getMyNotes() {

        User user = getCurrentUser();

        return noteRepository.findByUploader(user)
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    public Note getNoteEntity(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
    }

    @Override
    public void deleteNote(Long id) {
        User user = getCurrentUser();
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (!note.getUploader().getId().equals(user.getId())) {
            throw new BadRequestException("You can only delete your own notes");
        }

        noteRepository.delete(note);
    }

    private NoteResponse map(Note note) {

        String fileUrl = note.getFileUrl();
        if (fileUrl == null || fileUrl.isEmpty()) {
            fileUrl = "http://localhost:8080/api/notes/" + note.getId() + "/file";
        }

        return NoteResponse.builder()
                .id(note.getId())
                .title(note.getTitle())
                .subject(note.getSubject())
                .semester(note.getSemester())
                .fileUrl(fileUrl)
                .avgRating(note.getAvgRating())
                .uploaderName(note.getUploader() != null ? note.getUploader().getName() : "Anonymous")
                .build();
    }
}