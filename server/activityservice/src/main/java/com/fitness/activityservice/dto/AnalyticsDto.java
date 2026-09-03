package com.fitness.activityservice.dto;

/**
 * Wrapper holding all analytics DTO types for the activityservice.
 * Keeps imports clean: AnalyticsDto.StreakDto, AnalyticsDto.WeeklyVolumeDto, etc.
 */
public final class AnalyticsDto {

    private AnalyticsDto() {}

    public record StreakDto(
            int currentStreak,
            int longestStreak,
            String lastActivityDate  // ISO date string, null if no activities
    ) {}

    public record WeeklyVolumeDto(
            String date,          // ISO date (yyyy-MM-dd)
            int totalMinutes,
            int totalCalories,
            int sessionCount
    ) {}

    public record SummaryDto(
            long totalSessions,
            long totalCalories,
            double avgDurationMinutes
    ) {}

    public record TypeBreakdownDto(
            String type,
            long count,
            double percentage
    ) {}
}
