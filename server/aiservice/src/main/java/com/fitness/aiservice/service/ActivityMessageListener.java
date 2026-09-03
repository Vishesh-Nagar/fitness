package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import com.fitness.common.event.ActivityEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "activity-events", groupId = "ai-service-group", concurrency = "3")
    public void processActivity(
            @Payload ActivityEvent event,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("Received activity {} from partition {} offset {}",
                event.getActivityId(), partition, offset);

        try {
            Recommendation recommendation = Objects.requireNonNull(aiService.generateRecommendation(event), "recommendation must not be null");
            recommendationRepository.save(recommendation);
            log.info("Saved recommendation for activity {}", event.getActivityId());

            // Push real-time notification via WebSocket (Phase 11)
            messagingTemplate.convertAndSend(
                    "/topic/recommendations/" + event.getUserId(),
                    Objects.requireNonNull(Map.of(
                            "activityId", event.getActivityId(),
                            "message", "Your AI recommendation is ready!"
                    ), "payload must not be null")
            );
        } catch (Exception e) {
            log.error("Failed to process activity {}: {}", event.getActivityId(), e.getMessage(), e);
        }
    }
}