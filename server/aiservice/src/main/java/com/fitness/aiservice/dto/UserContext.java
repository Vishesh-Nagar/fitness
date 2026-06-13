package com.fitness.aiservice.dto;

import com.fitness.aiservice.model.Activity;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class UserContext {
    private int currentStreak;
    private int totalSessions;
    private Map<String, String> personalRecords;
    private Activity previousActivity;
}