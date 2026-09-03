package com.fitness.aiservice.dto;

import com.fitness.common.event.ActivityEvent;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class UserContext {
    private int currentStreak;
    private int totalSessions;
    private Map<String, String> personalRecords;
    private ActivityEvent previousActivity;
}