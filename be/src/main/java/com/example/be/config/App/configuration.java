package com.example.be.config.App;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class configuration {
  @Bean
  SecurityFilterChain springSecurityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(c -> c.disable());
    http.oauth2ResourceServer(configurer -> configurer.jwt(Customizer.withDefaults()));

    return http.build();
  }
}