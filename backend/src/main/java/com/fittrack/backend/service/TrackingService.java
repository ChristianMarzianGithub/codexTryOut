package com.fittrack.backend.service;

import com.fittrack.backend.model.Meal;
import com.fittrack.backend.model.User;
import com.fittrack.backend.model.Workout;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public final class TrackingService {
    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    public void saveUser(User user) {
        lock.writeLock().lock();
        try {
            users.put(user.getId(), user);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Optional<User> findUser(String userId) {
        lock.readLock().lock();
        try {
            return Optional.ofNullable(users.get(userId));
        } finally {
            lock.readLock().unlock();
        }
    }

    public List<Workout> listWorkouts(String userId) {
        lock.readLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return List.of();
            }
            return new ArrayList<>(user.getWorkouts());
        } finally {
            lock.readLock().unlock();
        }
    }

    public List<Meal> listMeals(String userId) {
        lock.readLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return List.of();
            }
            return new ArrayList<>(user.getMeals());
        } finally {
            lock.readLock().unlock();
        }
    }

    public Workout addWorkout(String userId, Workout workout) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }
            List<Workout> workouts = new ArrayList<>(user.getWorkouts());
            workouts.add(workout);
            users.put(userId, user.copyWithLists(workouts, user.getMeals()));
            return workout;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Optional<Workout> updateWorkout(String userId, String workoutId, Workout updated) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return Optional.empty();
            }
            List<Workout> workouts = new ArrayList<>(user.getWorkouts());
            for (int i = 0; i < workouts.size(); i++) {
                if (workouts.get(i).getId().equals(workoutId)) {
                    workouts.set(i, updated);
                    users.put(userId, user.copyWithLists(workouts, user.getMeals()));
                    return Optional.of(updated);
                }
            }
            return Optional.empty();
        } finally {
            lock.writeLock().unlock();
        }
    }

    public boolean deleteWorkout(String userId, String workoutId) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return false;
            }
            List<Workout> workouts = new ArrayList<>(user.getWorkouts());
            boolean removed = workouts.removeIf(workout -> workout.getId().equals(workoutId));
            if (removed) {
                users.put(userId, user.copyWithLists(workouts, user.getMeals()));
            }
            return removed;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Meal addMeal(String userId, Meal meal) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found");
            }
            List<Meal> meals = new ArrayList<>(user.getMeals());
            meals.add(meal);
            users.put(userId, user.copyWithLists(user.getWorkouts(), meals));
            return meal;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Optional<Meal> updateMeal(String userId, String mealId, Meal updated) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return Optional.empty();
            }
            List<Meal> meals = new ArrayList<>(user.getMeals());
            for (int i = 0; i < meals.size(); i++) {
                if (meals.get(i).getId().equals(mealId)) {
                    meals.set(i, updated);
                    users.put(userId, user.copyWithLists(user.getWorkouts(), meals));
                    return Optional.of(updated);
                }
            }
            return Optional.empty();
        } finally {
            lock.writeLock().unlock();
        }
    }

    public boolean deleteMeal(String userId, String mealId) {
        lock.writeLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return false;
            }
            List<Meal> meals = new ArrayList<>(user.getMeals());
            boolean removed = meals.removeIf(meal -> meal.getId().equals(mealId));
            if (removed) {
                users.put(userId, user.copyWithLists(user.getWorkouts(), meals));
            }
            return removed;
        } finally {
            lock.writeLock().unlock();
        }
    }

    public Map<String, Object> buildStats(String userId) {
        lock.readLock().lock();
        try {
            User user = users.get(userId);
            if (user == null) {
                return Map.of();
            }
            int totalWorkoutMinutes = 0;
            int totalWorkoutCalories = 0;
            for (Workout workout : user.getWorkouts()) {
                totalWorkoutMinutes += Math.max(0, workout.getDurationMinutes());
                totalWorkoutCalories += Math.max(0, workout.getCaloriesBurned());
            }
            int totalMealCalories = 0;
            int totalProtein = 0;
            int totalCarbs = 0;
            int totalFats = 0;
            for (Meal meal : user.getMeals()) {
                totalMealCalories += Math.max(0, meal.getCalories());
                totalProtein += Math.max(0, meal.getProtein());
                totalCarbs += Math.max(0, meal.getCarbs());
                totalFats += Math.max(0, meal.getFats());
            }
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalWorkoutMinutes", totalWorkoutMinutes);
            stats.put("totalWorkoutCalories", totalWorkoutCalories);
            stats.put("totalMealCalories", totalMealCalories);
            stats.put("totalProtein", totalProtein);
            stats.put("totalCarbs", totalCarbs);
            stats.put("totalFats", totalFats);
            stats.put("workoutCount", user.getWorkouts().size());
            stats.put("mealCount", user.getMeals().size());
            return stats;
        } finally {
            lock.readLock().unlock();
        }
    }

    public void mergeUser(User user) {
        lock.writeLock().lock();
        try {
            users.put(user.getId(), user);
        } finally {
            lock.writeLock().unlock();
        }
    }

    public void ensureUser(User user) {
        mergeUser(user);
    }

    public void updateUserReference(User user) {
        mergeUser(user);
    }
}
