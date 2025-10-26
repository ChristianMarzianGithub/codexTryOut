package com.fittrack.backend.auth;

import com.fittrack.backend.model.User;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public final class AuthService {
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<String, User> usersById = new ConcurrentHashMap<>();
    private final JwtService jwtService;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public synchronized AuthResult register(String email, String password, String fullName) {
        if (usersByEmail.containsKey(email.toLowerCase())) {
            return AuthResult.failure("Email already registered");
        }
        String salt = PasswordHasher.generateSalt();
        String hashed = PasswordHasher.hashPassword(password, salt);
        User user = new User(email.toLowerCase(), fullName, hashed, salt);
        usersByEmail.put(user.getEmail(), user);
        usersById.put(user.getId(), user);
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResult.success(token, user);
    }

    public AuthResult login(String email, String password) {
        User user = usersByEmail.get(email.toLowerCase());
        if (user == null) {
            return AuthResult.failure("Invalid credentials");
        }
        if (!PasswordHasher.verify(password, user.getSalt(), user.getPasswordHash())) {
            return AuthResult.failure("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return AuthResult.success(token, user);
    }

    public Optional<User> findById(String userId) {
        return Optional.ofNullable(usersById.get(userId));
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase()));
    }

    public JwtService getJwtService() {
        return jwtService;
    }

    public record AuthResult(boolean success, String message, String token, User user) {
        private static AuthResult failure(String message) {
            return new AuthResult(false, message, null, null);
        }

        private static AuthResult success(String token, User user) {
            return new AuthResult(true, null, token, user);
        }

        public Map<String, Object> toResponse() {
            if (!success) {
                return Map.of("success", false, "message", message);
            }
            Map<String, Object> userPayload = new HashMap<>();
            userPayload.put("id", user.getId());
            userPayload.put("email", user.getEmail());
            userPayload.put("fullName", user.getFullName());
            userPayload.put("createdAt", user.getCreatedAt().toString());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("user", userPayload);
            return response;
        }
    }
}
