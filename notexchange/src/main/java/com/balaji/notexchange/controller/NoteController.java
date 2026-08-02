package com.balaji.notexchange.controller;

import com.balaji.notexchange.dto.note.NoteResponse;
import com.balaji.notexchange.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import com.balaji.notexchange.entity.Note;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public NoteResponse upload(
            @RequestParam String title,
            @RequestParam String subject,
            @RequestParam Integer semester,
            @RequestParam MultipartFile file){

        return noteService.upload(title,subject,semester,file);
    }

    @GetMapping
    public List<NoteResponse> getAllNotes(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Integer semester) {

        return noteService.getAll(subject, semester);
    }

    @GetMapping("/{id}")
    public NoteResponse getNoteById(@PathVariable Long id) {

        return noteService.getById(id);
    }

    @GetMapping("/top")
    public List<NoteResponse> getTopNotes() {

        return noteService.getTopNotes();
    }

    @GetMapping("/mine")
    public List<NoteResponse> getMyNotes() {

        return noteService.getMyNotes();
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getNoteFile(@PathVariable Long id) {
        Note note = noteService.getNoteEntity(id);

        String contentType = note.getFileType() != null ? note.getFileType() : "application/pdf";
        String fileName = note.getFileName() != null ? note.getFileName() : "note-" + id + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(note.getFileData() != null ? note.getFileData() : new byte[0]);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadNoteFile(@PathVariable Long id) {
        Note note = noteService.getNoteEntity(id);

        String contentType = note.getFileType() != null ? note.getFileType() : "application/pdf";
        String fileName = note.getFileName() != null ? note.getFileName() : "note-" + id + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(note.getFileData() != null ? note.getFileData() : new byte[0]);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.ok("Note deleted successfully");
    }
}