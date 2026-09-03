package com.fitness.common.event;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Kafka event published by activityservice and consumed by aiservice.
 * Plain Java — no Lombok (avoids annotation processor Java 25 incompatibility).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityEvent {

    private String activityId;
    private String userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private LocalDateTime createdAt;
    private Map<String, Object> additionalMetrics;

    public ActivityEvent() {}

    public ActivityEvent(String activityId, String userId, String type, Integer duration,
                         Integer caloriesBurned, LocalDateTime startTime,
                         LocalDateTime createdAt, Map<String, Object> additionalMetrics) {
        this.activityId = activityId;
        this.userId = userId;
        this.type = type;
        this.duration = duration;
        this.caloriesBurned = caloriesBurned;
        this.startTime = startTime;
        this.createdAt = createdAt;
        this.additionalMetrics = additionalMetrics;
    }

    // Builder pattern — replaces @Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String activityId;
        private String userId;
        private String type;
        private Integer duration;
        private Integer caloriesBurned;
        private LocalDateTime startTime;
        private LocalDateTime createdAt;
        private Map<String, Object> additionalMetrics;

        public Builder activityId(String v)                      { this.activityId = v; return this; }
        public Builder userId(String v)                          { this.userId = v; return this; }
        public Builder type(String v)                            { this.type = v; return this; }
        public Builder duration(Integer v)                       { this.duration = v; return this; }
        public Builder caloriesBurned(Integer v)                 { this.caloriesBurned = v; return this; }
        public Builder startTime(LocalDateTime v)                { this.startTime = v; return this; }
        public Builder createdAt(LocalDateTime v)                { this.createdAt = v; return this; }
        public Builder additionalMetrics(Map<String, Object> v)  { this.additionalMetrics = v; return this; }

        public ActivityEvent build() {
            return new ActivityEvent(activityId, userId, type, duration,
                    caloriesBurned, startTime, createdAt, additionalMetrics);
        }
    }

    // Getters & setters
    public String getActivityId()                   { return activityId; }
    public void setActivityId(String v)             { this.activityId = v; }
    public String getUserId()                       { return userId; }
    public void setUserId(String v)                 { this.userId = v; }
    public String getType()                         { return type; }
    public void setType(String v)                   { this.type = v; }
    public Integer getDuration()                    { return duration; }
    public void setDuration(Integer v)              { this.duration = v; }
    public Integer getCaloriesBurned()              { return caloriesBurned; }
    public void setCaloriesBurned(Integer v)        { this.caloriesBurned = v; }
    public LocalDateTime getStartTime()             { return startTime; }
    public void setStartTime(LocalDateTime v)       { this.startTime = v; }
    public LocalDateTime getCreatedAt()             { return createdAt; }
    public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }
    public Map<String, Object> getAdditionalMetrics() { return additionalMetrics; }
    public void setAdditionalMetrics(Map<String, Object> v) { this.additionalMetrics = v; }

    @Override
    public String toString() {
        return "ActivityEvent{activityId='" + activityId + "', userId='" + userId +
               "', type='" + type + "', duration=" + duration + "}";
    }
}
