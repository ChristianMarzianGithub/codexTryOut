package com.fittrack.backend.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public final class User {
    private final String id;
    private final String email;
    private final String fullName;
    private final String passwordHash;
    private final String salt;
    private final Instant createdAt;
    private final List<Workout> workouts;
    private final List<Meal> meals;

    public User(String email, String fullName, String passwordHash, String salt) {
        this(UUID.randomUUID().toString(), email, fullName, passwordHash, salt, Instant.now(), new ArrayList<>(), new ArrayList<>());
    }

    private User(String id, String email, String fullName, String passwordHash, String salt, Instant createdAt,
                List<Workout> workouts, List<Meal> meals) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.passwordHash = passwordHash;
        this.salt = salt;
        this.createdAt = createdAt;
        this.workouts = workouts;
        this.meals = meals;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getSalt() {
        return salt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<Workout> getWorkouts() {
        return workouts;
    }

    public List<Meal> getMeals() {
        return meals;
    }

    public User copyWithLists(List<Workout> newWorkouts, List<Meal> newMeals) {
        return new User(id, email, fullName, passwordHash, salt, createdAt, newWorkouts, newMeals);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
