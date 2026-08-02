package com.balaji.notexchange.controller;

import com.balaji.notexchange.dto.auth.AuthResponse;
import com.balaji.notexchange.dto.auth.LoginRequest;
import com.balaji.notexchange.dto.auth.RegisterRequest;
import com.balaji.notexchange.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.balaji.notexchange.dto.auth.UserDto;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request) {

        return authService.login(request);
    }

    @GetMapping("/me")
    public UserDto getCurrentUser() {

        return authService.getCurrentUser();
    }
}