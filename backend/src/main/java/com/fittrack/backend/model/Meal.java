package com.fittrack.backend.model;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

public final class Meal {
    private final String id;
    private final String name;
    private final int calories;
    private final int protein;
    private final int carbs;
    private final int fats;
    private final LocalDate date;

    public Meal(String name, int calories, int protein, int carbs, int fats, LocalDate date) {
        this(UUID.randomUUID().toString(), name, calories, protein, carbs, fats, date);
    }

    public Meal(String id, String name, int calories, int protein, int carbs, int fats, LocalDate date) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getCalories() {
        return calories;
    }

    public int getProtein() {
        return protein;
    }

    public int getCarbs() {
        return carbs;
    }

    public int getFats() {
        return fats;
    }

    public LocalDate getDate() {
        return date;
    }

    public Meal withUpdates(String name, int calories, int protein, int carbs, int fats, LocalDate date) {
        return new Meal(id, name, calories, protein, carbs, fats, date);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Meal meal = (Meal) o;
        return id.equals(meal.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
