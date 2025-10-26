package com.fittrack.backend.auth;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.fittrack.backend.util.JsonUtil;

public final class JwtService {
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private final byte[] secret;
    private final long ttlSeconds;

    public JwtService(String secret, long ttlSeconds) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.ttlSeconds = ttlSeconds;
    }

    public String generateToken(String userId, String email) {
        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new HashMap<>();
        payload.put("sub", userId);
        payload.put("email", email);
        payload.put("exp", Instant.now().getEpochSecond() + ttlSeconds);

        String encodedHeader = base64UrlEncode(JsonUtil.stringify(header).getBytes(StandardCharsets.UTF_8));
        String encodedPayload = base64UrlEncode(JsonUtil.stringify(payload).getBytes(StandardCharsets.UTF_8));
        String signature = sign(encodedHeader + "." + encodedPayload);
        return encodedHeader + "." + encodedPayload + "." + signature;
    }

    public Map<String, Object> validate(String token) {
        if (token == null || token.isBlank()) {
            return Map.of();
        }
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return Map.of();
        }
        String expectedSignature = sign(parts[0] + "." + parts[1]);
        if (!constantTimeEquals(expectedSignature, parts[2])) {
            return Map.of();
        }
        String payloadJson = new String(base64UrlDecode(parts[1]), StandardCharsets.UTF_8);
        Map<String, Object> payload = JsonUtil.parseObject(payloadJson);
        Object exp = payload.get("exp");
        long now = Instant.now().getEpochSecond();
        if (exp instanceof Number number && number.longValue() >= now) {
            return payload;
        }
        return Map.of();
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            byte[] signature = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return base64UrlEncode(signature);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to sign token", e);
        }
    }

    private static String base64UrlEncode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static byte[] base64UrlDecode(String value) {
        return Base64.getUrlDecoder().decode(value);
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
