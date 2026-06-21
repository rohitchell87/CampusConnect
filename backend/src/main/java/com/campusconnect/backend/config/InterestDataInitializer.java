package com.campusconnect.backend.config;

import com.campusconnect.backend.entity.Interest;
import com.campusconnect.backend.repository.InterestRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InterestDataInitializer implements CommandLineRunner {

    private final InterestRepository interestRepository;

    public InterestDataInitializer(InterestRepository interestRepository) {
        this.interestRepository = interestRepository;
    }

    @Override
    public void run(String... args) {
        if (interestRepository.count() > 0) {
            return;
        }

        List<Interest> interests = List.of(
                Interest.builder().name("Coding").icon("💻").build(),
                Interest.builder().name("Gym").icon("🏋️").build(),
                Interest.builder().name("Cricket").icon("🏏").build(),
                Interest.builder().name("Football").icon("🏈").build(),
                Interest.builder().name("Basketball").icon("🏀").build(),
                Interest.builder().name("Movies").icon("🎬").build(),
                Interest.builder().name("Music").icon("🎵").build(),
                Interest.builder().name("Photography").icon("📷").build(),
                Interest.builder().name("Reading").icon("📚").build(),
                Interest.builder().name("Chess").icon("♟️").build(),
                Interest.builder().name("Travel").icon("✈️").build(),
                Interest.builder().name("AI").icon("🤖").build(),
                Interest.builder().name("Anime").icon("🎌").build(),
                Interest.builder().name("Food").icon("🍕").build(),
                Interest.builder().name("Startups").icon("🚀").build()
        );

        interestRepository.saveAll(interests);
    }
}
