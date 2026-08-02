package com.balaji.notexchange.service;

import com.balaji.notexchange.dto.auth.AuthResponse;
import com.balaji.notexchange.dto.auth.LoginRequest;
import com.balaji.notexchange.dto.auth.RegisterRequest;

import com.balaji.notexchange.dto.auth.UserDto;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserDto getCurrentUser();
}