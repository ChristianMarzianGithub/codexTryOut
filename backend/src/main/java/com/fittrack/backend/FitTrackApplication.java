package com.fittrack.backend;

import com.fittrack.backend.api.ApiHandler;
import com.fittrack.backend.auth.AuthService;
import com.fittrack.backend.auth.JwtService;
import com.fittrack.backend.service.TrackingService;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.time.Duration;

public final class FitTrackApplication {
    private FitTrackApplication() {
    }

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        String jwtSecret = System.getenv().getOrDefault("JWT_SECRET", "local-development-secret");
        long tokenTtl = Long.parseLong(System.getenv().getOrDefault("JWT_TTL_SECONDS", String.valueOf(Duration.ofHours(12).toSeconds())));

        TrackingService trackingService = new TrackingService();
        JwtService jwtService = new JwtService(jwtSecret, tokenTtl);
        AuthService authService = new AuthService(jwtService);

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", new ApiHandler(authService, trackingService));
        server.setExecutor(null);
        System.out.println("FitTrack backend listening on port " + port);
        server.start();
    }
}
