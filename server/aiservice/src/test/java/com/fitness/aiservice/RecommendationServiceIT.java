package com.fitness.aiservice;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import com.fitness.aiservice.service.GeminiService;
import com.fitness.common.event.ActivityEvent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.ConfluentKafkaContainer;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@Testcontainers
class RecommendationServiceIT {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:6.0");

    @Container
    static ConfluentKafkaContainer kafka =
            new ConfluentKafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        registry.add("spring.cloud.config.enabled", () -> "false");
        registry.add("eureka.client.enabled", () -> "false");
        registry.add("gemini.api.key", () -> "test-key");
        registry.add("gemini.api.url", () -> "http://localhost");
    }

    @MockitoBean
    GeminiService geminiService;

    @Autowired
    KafkaTemplate<String, ActivityEvent> kafkaTemplate;

    @Autowired
    RecommendationRepository recommendationRepository;

    @Test
    void givenActivityEvent_whenPublishedToKafka_thenRecommendationPersisted() {
        // Mock the Gemini AI call to return a valid JSON response
        when(geminiService.getAnswer(any())).thenReturn("""
                {
                  "candidates": [{
                    "content": {
                      "parts": [{
                        "text": "{\\"analysis\\":{\\"overall\\":\\"Great run!\\",\\"pace\\":\\"Good\\",\\"heartRate\\":\\"N/A\\",\\"caloriesBurned\\":\\"Well done\\"},\\"improvements\\":[{\\"area\\":\\"Form\\",\\"recommendation\\":\\"Keep arms relaxed\\"}],\\"suggestions\\":[{\\"workout\\":\\"Recovery run\\",\\"description\\":\\"Easy 20 min run\\"}],\\"safety\\":[\\"Stay hydrated\\"]}"
                      }]
                    }
                  }]
                }
                """);

        ActivityEvent event = ActivityEvent.builder()
                .activityId("it-act-1")
                .userId("it-user-1")
                .type("RUNNING")
                .duration(45)
                .caloriesBurned(400)
                .startTime(LocalDateTime.now())
                .build();

        kafkaTemplate.send("activity-events", Objects.requireNonNull(event.getUserId(), "userId must not be null"), event);

        // Wait up to 15 seconds for the Kafka consumer to process and persist
        await().atMost(15, SECONDS).until(() ->
                recommendationRepository.findByActivityId("it-act-1").isPresent());

        Optional<Recommendation> rec = recommendationRepository.findByActivityId("it-act-1");
        assertThat(rec).isPresent();
        assertThat(rec.get().getRecommendation()).contains("Great run!");
    }
}
