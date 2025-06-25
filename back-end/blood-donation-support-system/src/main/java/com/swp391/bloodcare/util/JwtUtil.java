package com.swp391.bloodcare.util;

import com.swp391.bloodcare.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret:supersecuresecretkeyforjwt1234567890!}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private Long expiration;

    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // tạo jwt token từ username
    public String generateToken(Account account) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", account.getUserName());
        claims.put("role", account.getRole().getRole());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(account.getAccountId()) // ✅ set subject là accountId
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // ví dụ 24h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String createToken(Map<String, Object> claims, String subject){
        return Jwts.builder().setClaims(claims).setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token){
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //lấy username từ token
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    //Lấy accountId
    public String extractAccountId(String token) {
        return extractAllClaims(token).getSubject(); // subject là accountId
    }



    // lấy expiration date từ token
    public Date extractExpiration(String token){
        return extractClaim(token, Claims::getExpiration);
    }

    // kiểm tra token có hết hạn không?
    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //validate token
    public Boolean validateToken(String token, String username){
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }



}
