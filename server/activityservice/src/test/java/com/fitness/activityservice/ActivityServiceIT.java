package com.fitness.activityservice;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.ActivityType;
import com.fitness.common.dto.ErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.ConfluentKafkaContainer;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ActivityServiceIT {

    @Container
    static MongoDBContainer mongo = new MongoDBContainer("mongo:6.0");

    @Container
    static ConfluentKafkaContainer kafka =
            new ConfluentKafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongo::getReplicaSetUrl);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
        // Disable config server and eureka for tests
        registry.add("spring.cloud.config.enabled", () -> "false");
        registry.add("eureka.client.enabled", () -> "false");
        registry.add("jwt.secret", () -> "test-secret-key-that-is-long-enough-for-hmac256");
    }

    @Autowired
    TestRestTemplate restTemplate;

    @Test
    void trackActivity_validRequest_returns200() {
        ActivityRequest req = new ActivityRequest();
        req.setUserId("user-it-test");
        req.setType(ActivityType.RUNNING);
        req.setDuration(30);
        req.setCaloriesBurned(300);
        req.setStartTime(LocalDateTime.now());

        ResponseEntity<ActivityResponse> resp =
                restTemplate.postForEntity("/api/activities", req, ActivityResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        ActivityResponse body = Objects.requireNonNull(resp.getBody(), "Response body must not be null");
        assertThat(body.getId()).isNotBlank();
    }

    @Test
    void trackActivity_negativeDuration_returns400() {
        ActivityRequest req = new ActivityRequest();
        req.setUserId("user-it-test");
        req.setType(ActivityType.CYCLING);
        req.setDuration(-1);
        req.setCaloriesBurned(200);
        req.setStartTime(LocalDateTime.now());

        ResponseEntity<ErrorResponse> resp =
                restTemplate.postForEntity("/api/activities", req, ErrorResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        ErrorResponse errBody = Objects.requireNonNull(resp.getBody(), "Error response body must not be null");
        assertThat(errBody.getFieldErrors()).containsKey("duration");
    }

    @Test
    void getActivity_nonExistentId_returns404() {
        ResponseEntity<ErrorResponse> resp =
                restTemplate.getForEntity("/api/activities/nonexistent-id", ErrorResponse.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
