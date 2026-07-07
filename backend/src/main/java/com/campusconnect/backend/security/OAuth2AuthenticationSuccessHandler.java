package com.campusconnect.backend.security;

import com.campusconnect.backend.service.JwtService;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final JwtService jwtService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2AuthenticationSuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        String email = null;
        if (principal instanceof OAuth2User) {
            OAuth2User user = (OAuth2User) principal;
            Object e = user.getAttributes().get("email");
            email = e != null ? e.toString() : null;
        }

        if (email == null) {
            logger.warn("OAuth2 authentication succeeded but no email found on principal");
            response.sendRedirect(frontendUrl + "/login?error=oauth_no_email");
            return;
        }

        // generate our application's JWT for the user
        String token = jwtService.generateToken(email);

        // Redirect to frontend with token as query param
        String redirectUrl = frontendUrl + "/?token=" + token;
        logger.debug("Redirecting OAuth2 login to {}", redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
