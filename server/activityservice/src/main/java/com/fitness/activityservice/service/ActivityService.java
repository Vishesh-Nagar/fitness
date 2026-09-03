package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.config.KafkaTopicConfig;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.exception.ActivityNotFoundException;
import com.fitness.activityservice.model.Activity;
import com.fitness.common.event.ActivityEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, ActivityEvent> kafkaTemplate;

    @SuppressWarnings("null")
    public ActivityResponse trackActivity(ActivityRequest request) {
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = Objects.requireNonNull(activityRepository.save(activity), "Saved activity must not be null");

        // Build the shared ActivityEvent and publish to Kafka
        ActivityEvent event = ActivityEvent.builder()
                .activityId(savedActivity.getId())
                .userId(savedActivity.getUserId())
                .type(savedActivity.getType() != null ? savedActivity.getType().name() : null)
                .duration(savedActivity.getDuration())
                .caloriesBurned(savedActivity.getCaloriesBurned())
                .startTime(savedActivity.getStartTime())
                .createdAt(savedActivity.getCreatedAt())
                .additionalMetrics(savedActivity.getAdditionalMetrics())
                .build();

        CompletableFuture<SendResult<String, ActivityEvent>> future =
                kafkaTemplate.send(KafkaTopicConfig.ACTIVITY_EVENTS_TOPIC,
                        Objects.requireNonNull(event.getUserId(), "userId must not be null"),
                        event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish activity {} to Kafka: {}",
                        savedActivity.getId(), ex.getMessage());
            } else {
                log.info("Published activity {} to Kafka partition {} offset {}",
                        savedActivity.getId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        return activityRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(Objects.requireNonNull(activityId, "activityId must not be null"))
                .map(this::mapToResponse)
                .orElseThrow(() -> new ActivityNotFoundException(activityId));
    }
}