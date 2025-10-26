package com.fittrack.backend.api;

import com.fittrack.backend.auth.AuthService;
import com.fittrack.backend.model.Meal;
import com.fittrack.backend.model.User;
import com.fittrack.backend.model.Workout;
import com.fittrack.backend.service.TrackingService;
import com.fittrack.backend.util.HttpUtil;
import com.fittrack.backend.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public final class ApiHandler implements HttpHandler {
    private final AuthService authService;
    private final TrackingService trackingService;

    public ApiHandler(AuthService authService, TrackingService trackingService) {
        this.authService = authService;
        this.trackingService = trackingService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        HttpUtil.addCorsHeaders(exchange);
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtil.sendEmpty(exchange, 204);
            return;
        }

        String path = exchange.getRequestURI().getPath().substring("/api".length());
        if (path.isEmpty()) {
            path = "/";
        }

        switch (path) {
            case "/auth/register" -> handleRegister(exchange);
            case "/auth/login" -> handleLogin(exchange);
            case "/users/me" -> handleCurrentUser(exchange);
            case "/users/stats" -> handleStats(exchange);
            case "/workouts" -> handleWorkouts(exchange);
            case "/meals" -> handleMeals(exchange);
            default -> {
                if (path.startsWith("/workouts/")) {
                    handleWorkoutById(exchange, path.substring("/workouts/".length()));
                } else if (path.startsWith("/meals/")) {
                    handleMealById(exchange, path.substring("/meals/".length()));
                } else {
                    HttpUtil.sendError(exchange, 404, "Not found");
                }
            }
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtil.sendError(exchange, 405, "Method not allowed");
            return;
        }
        Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
        String email = stringValue(body.get("email"));
        String password = stringValue(body.get("password"));
        String fullName = stringValue(body.getOrDefault("fullName", ""));
        if (email.isBlank() || password.isBlank()) {
            HttpUtil.sendError(exchange, 400, "Email and password are required");
            return;
        }
        AuthService.AuthResult result = authService.register(email, password, fullName);
        if (!result.success()) {
            HttpUtil.sendError(exchange, 409, result.message());
            return;
        }
        trackingService.saveUser(result.user());
        HttpUtil.sendJson(exchange, 201, result.toResponse());
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtil.sendError(exchange, 405, "Method not allowed");
            return;
        }
        Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
        String email = stringValue(body.get("email"));
        String password = stringValue(body.get("password"));
        AuthService.AuthResult result = authService.login(email, password);
        if (!result.success()) {
            HttpUtil.sendError(exchange, 401, result.message());
            return;
        }
        trackingService.ensureUser(result.user());
        HttpUtil.sendJson(exchange, 200, result.toResponse());
    }

    private void handleCurrentUser(HttpExchange exchange) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", user.get().getId());
        payload.put("email", user.get().getEmail());
        payload.put("fullName", user.get().getFullName());
        payload.put("createdAt", user.get().getCreatedAt().toString());
        HttpUtil.sendJson(exchange, 200, payload);
    }

    private void handleStats(HttpExchange exchange) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        Map<String, Object> stats = trackingService.buildStats(user.get().getId());
        HttpUtil.sendJson(exchange, 200, stats);
    }

    private void handleWorkouts(HttpExchange exchange) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        String method = exchange.getRequestMethod();
        String userId = user.get().getId();
        switch (method) {
            case "GET" -> {
                List<Map<String, Object>> payload = new ArrayList<>();
                for (Workout workout : trackingService.listWorkouts(userId)) {
                    payload.add(workoutToMap(workout));
                }
                HttpUtil.sendJsonArray(exchange, 200, payload);
            }
            case "POST" -> {
                Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
                Workout workout = new Workout(
                        stringValue(body.get("type")),
                        numberValue(body.get("durationMinutes")).intValue(),
                        numberValue(body.get("caloriesBurned")).intValue(),
                        parseDate(stringValue(body.get("date")))
                );
                trackingService.addWorkout(userId, workout);
                HttpUtil.sendJson(exchange, 201, workoutToMap(workout));
            }
            default -> HttpUtil.sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleWorkoutById(HttpExchange exchange, String id) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        String method = exchange.getRequestMethod();
        String userId = user.get().getId();
        switch (method) {
            case "PUT" -> {
                Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
                Workout updated = new Workout(
                        id,
                        stringValue(body.get("type")),
                        numberValue(body.get("durationMinutes")).intValue(),
                        numberValue(body.get("caloriesBurned")).intValue(),
                        parseDate(stringValue(body.get("date")))
                );
                Optional<Workout> saved = trackingService.updateWorkout(userId, id, updated);
                if (saved.isEmpty()) {
                    HttpUtil.sendError(exchange, 404, "Workout not found");
                    return;
                }
                HttpUtil.sendJson(exchange, 200, workoutToMap(saved.get()));
            }
            case "DELETE" -> {
                if (trackingService.deleteWorkout(userId, id)) {
                    HttpUtil.sendEmpty(exchange, 204);
                } else {
                    HttpUtil.sendError(exchange, 404, "Workout not found");
                }
            }
            default -> HttpUtil.sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleMeals(HttpExchange exchange) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        String method = exchange.getRequestMethod();
        String userId = user.get().getId();
        switch (method) {
            case "GET" -> {
                List<Map<String, Object>> payload = new ArrayList<>();
                for (Meal meal : trackingService.listMeals(userId)) {
                    payload.add(mealToMap(meal));
                }
                HttpUtil.sendJsonArray(exchange, 200, payload);
            }
            case "POST" -> {
                Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
                Meal meal = new Meal(
                        stringValue(body.get("name")),
                        numberValue(body.get("calories")).intValue(),
                        numberValue(body.getOrDefault("protein", 0)).intValue(),
                        numberValue(body.getOrDefault("carbs", 0)).intValue(),
                        numberValue(body.getOrDefault("fats", 0)).intValue(),
                        parseDate(stringValue(body.get("date")))
                );
                trackingService.addMeal(userId, meal);
                HttpUtil.sendJson(exchange, 201, mealToMap(meal));
            }
            default -> HttpUtil.sendError(exchange, 405, "Method not allowed");
        }
    }

    private void handleMealById(HttpExchange exchange, String id) throws IOException {
        Optional<User> user = authenticate(exchange);
        if (user.isEmpty()) {
            return;
        }
        String method = exchange.getRequestMethod();
        String userId = user.get().getId();
        switch (method) {
            case "PUT" -> {
                Map<String, Object> body = JsonUtil.parseObject(HttpUtil.readBody(exchange));
                Meal updated = new Meal(
                        id,
                        stringValue(body.get("name")),
                        numberValue(body.get("calories")).intValue(),
                        numberValue(body.getOrDefault("protein", 0)).intValue(),
                        numberValue(body.getOrDefault("carbs", 0)).intValue(),
                        numberValue(body.getOrDefault("fats", 0)).intValue(),
                        parseDate(stringValue(body.get("date")))
                );
                Optional<Meal> saved = trackingService.updateMeal(userId, id, updated);
                if (saved.isEmpty()) {
                    HttpUtil.sendError(exchange, 404, "Meal not found");
                    return;
                }
                HttpUtil.sendJson(exchange, 200, mealToMap(saved.get()));
            }
            case "DELETE" -> {
                if (trackingService.deleteMeal(userId, id)) {
                    HttpUtil.sendEmpty(exchange, 204);
                } else {
                    HttpUtil.sendError(exchange, 404, "Meal not found");
                }
            }
            default -> HttpUtil.sendError(exchange, 405, "Method not allowed");
        }
    }

    private Optional<User> authenticate(HttpExchange exchange) throws IOException {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            HttpUtil.sendError(exchange, 401, "Missing Authorization header");
            return Optional.empty();
        }
        String token = authHeader.substring("Bearer ".length());
        Map<String, Object> payload = authService.getJwtService().validate(token);
        String userId = stringValue(payload.get("sub"));
        if (userId.isBlank()) {
            HttpUtil.sendError(exchange, 401, "Invalid token");
            return Optional.empty();
        }
        Optional<User> user = trackingService.findUser(userId);
        if (user.isEmpty()) {
            Optional<User> authUser = authService.findById(userId);
            authUser.ifPresent(trackingService::updateUserReference);
            user = trackingService.findUser(userId);
        }
        if (user.isEmpty()) {
            HttpUtil.sendError(exchange, 401, "Unknown account");
        }
        return user;
    }

    private static String stringValue(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    private static Number numberValue(Object value) {
        if (value instanceof Number number) {
            return number;
        }
        if (value instanceof String str && !str.isBlank()) {
            try {
                if (str.contains(".")) {
                    return Double.parseDouble(str);
                }
                return Integer.parseInt(str);
            } catch (NumberFormatException ignored) {
            }
        }
        return 0;
    }

    private static LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return LocalDate.now();
        }
        return LocalDate.parse(value);
    }

    private static Map<String, Object> workoutToMap(Workout workout) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", workout.getId());
        map.put("type", workout.getType());
        map.put("durationMinutes", workout.getDurationMinutes());
        map.put("caloriesBurned", workout.getCaloriesBurned());
        map.put("date", workout.getDate().toString());
        return map;
    }

    private static Map<String, Object> mealToMap(Meal meal) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", meal.getId());
        map.put("name", meal.getName());
        map.put("calories", meal.getCalories());
        map.put("protein", meal.getProtein());
        map.put("carbs", meal.getCarbs());
        map.put("fats", meal.getFats());
        map.put("date", meal.getDate().toString());
        return map;
    }
}
