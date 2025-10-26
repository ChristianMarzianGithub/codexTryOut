package com.fittrack.backend.model;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

public final class Workout {
    private final String id;
    private final String type;
    private final int durationMinutes;
    private final int caloriesBurned;
    private final LocalDate date;

    public Workout(String type, int durationMinutes, int caloriesBurned, LocalDate date) {
        this(UUID.randomUUID().toString(), type, durationMinutes, caloriesBurned, date);
    }

    public Workout(String id, String type, int durationMinutes, int caloriesBurned, LocalDate date) {
        this.id = id;
        this.type = type;
        this.durationMinutes = durationMinutes;
        this.caloriesBurned = caloriesBurned;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public int getCaloriesBurned() {
        return caloriesBurned;
    }

    public LocalDate getDate() {
        return date;
    }

    public Workout withUpdates(String type, int durationMinutes, int caloriesBurned, LocalDate date) {
        return new Workout(id, type, durationMinutes, caloriesBurned, date);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Workout workout = (Workout) o;
        return id.equals(workout.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
