package com.guizim.server.configs;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.guizim.server.security.JWTAuthenticationFilter;
import com.guizim.server.security.JWTAuthorizationFilter;
import com.guizim.server.security.JWTUtil;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // substitui EnableGlobalMethodSecurity
public class SecurityConfig {

        private AuthenticationManager authenticationManager;

        @Autowired
        private UserDetailsService userDetailService;

        @Autowired
        private JWTUtil jwtUtil;

        private static final String[] PUBLIC_MATCHERS = {
                        "/"
        };

        private static final String[] PUBLIC_MATCHERS_POST = {
                        "/user",
                        "/login",
                        "/register"
        };

        private static final String[] PUBLIC_MATCHERS_DELETE = {
                        "/user/{id}",
                        "/team/{team}",
                        "/info/{team}"
        };

        private static final String[] PUBLIC_MATCHERS_PUT = {
                        "/user/{id}",
                        "/team/{team}",
                        "/info/{team}"
        };

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                // CORS + CSRF
                http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable());

                // AuthenticationManager (mantendo seu padrão)
                AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);

                authBuilder.userDetailsService(userDetailService)
                                .passwordEncoder(bCryptPasswordEncoder());

                this.authenticationManager = authBuilder.build();

                http.authenticationManager(this.authenticationManager);

                // Autorização (novo padrão)
                http.authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.DELETE, PUBLIC_MATCHERS_DELETE).permitAll()
                                .requestMatchers(HttpMethod.POST, PUBLIC_MATCHERS_POST).permitAll()
                                .requestMatchers(HttpMethod.PUT, PUBLIC_MATCHERS_PUT).permitAll()
                                .requestMatchers(PUBLIC_MATCHERS).permitAll()
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                .requestMatchers("/auth/**").permitAll()
                                .anyRequest().authenticated());

                // Stateless
                http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                // Filtros JWT (mantive como você fez)
                http.addFilter(new JWTAuthenticationFilter(this.authenticationManager, this.jwtUtil));
                http.addFilter(new JWTAuthorizationFilter(this.authenticationManager, this.jwtUtil,
                                this.userDetailService));

                return http.build();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                configuration.setAllowedOrigins(Arrays.asList(
                                "http://localhost:5173",
                                "https://scout-two-ochre.vercel.app",
                                "https://axionscout.vercel.app"));

                configuration.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "OPTIONS"));

                configuration.setAllowedHeaders(Arrays.asList(
                                "Authorization",
                                "Content-Type"));

                configuration.setExposedHeaders(Arrays.asList(
                                "Authorization"));

                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }

        @Bean
        public BCryptPasswordEncoder bCryptPasswordEncoder() {
                return new BCryptPasswordEncoder();
        }
}
