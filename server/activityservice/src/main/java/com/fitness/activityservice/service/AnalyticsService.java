package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.dto.AnalyticsDto.*;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ActivityRepository activityRepository;

    // ─────────────────────── Streak Tracking ───────────────────────

    public StreakDto getStreaks(String userId) {
        List<Activity> activities = activityRepository.findByUserIdOrderByStartTimeDesc(userId);
        if (activities.isEmpty()) {
            return new StreakDto(0, 0, null);
        }

        // Collect unique calendar dates (sorted descending)
        List<LocalDate> sortedDates = activities.stream()
                .map(a -> a.getStartTime().toLocalDate())
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();

        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 1;
        LocalDate today = LocalDate.now();

        // Current streak: count consecutive days from today backwards
        LocalDate expected = today;
        for (LocalDate date : sortedDates) {
            if (date.equals(expected) || date.equals(expected.minusDays(1))) {
                if (date.equals(expected)) {
                    currentStreak++;
                    expected = date.minusDays(1);
                }
            } else {
                break;
            }
        }

        // Longest streak: walk entire sorted list
        for (int i = 1; i < sortedDates.size(); i++) {
            if (sortedDates.get(i - 1).minusDays(1).equals(sortedDates.get(i))) {
                tempStreak++;
            } else {
                longestStreak = Math.max(longestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        String lastDate = sortedDates.get(0).toString();
        return new StreakDto(currentStreak, longestStreak, lastDate);
    }

    // ─────────────────────── Weekly Volume ───────────────────────

    public List<WeeklyVolumeDto> getWeeklyVolume(String userId, LocalDate from, LocalDate to) {
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.atTime(23, 59, 59);

        List<Activity> activities = activityRepository
                .findByUserIdAndStartTimeBetweenOrderByStartTimeDesc(userId, fromDt, toDt);

        // Group by date
        Map<LocalDate, List<Activity>> byDate = activities.stream()
                .collect(Collectors.groupingBy(a -> a.getStartTime().toLocalDate()));

        // Fill each day in range
        List<WeeklyVolumeDto> result = new ArrayList<>();
        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            List<Activity> dayActivities = byDate.getOrDefault(cursor, List.of());
            int totalMinutes = dayActivities.stream()
                    .mapToInt(a -> a.getDuration() != null ? a.getDuration() : 0).sum();
            int totalCalories = dayActivities.stream()
                    .mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();
            result.add(new WeeklyVolumeDto(cursor.toString(), totalMinutes, totalCalories, dayActivities.size()));
            cursor = cursor.plusDays(1);
        }
        return result;
    }

    // ─────────────────────── Summary Stats ───────────────────────

    public SummaryDto getSummary(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        long totalSessions = activities.size();
        long totalCalories = activities.stream()
                .mapToLong(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();
        double avgDuration = activities.stream()
                .mapToInt(a -> a.getDuration() != null ? a.getDuration() : 0)
                .average().orElse(0.0);
        return new SummaryDto(totalSessions, totalCalories, Math.round(avgDuration * 10.0) / 10.0);
    }

    // ─────────────────────── Type Breakdown ───────────────────────

    public List<TypeBreakdownDto> getTypeBreakdown(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        if (activities.isEmpty()) return List.of();

        Map<String, Long> counts = activities.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getType() != null ? a.getType().name() : "UNKNOWN",
                        Collectors.counting()));

        long total = activities.size();
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> new TypeBreakdownDto(
                        e.getKey(),
                        e.getValue(),
                        Math.round(e.getValue() * 1000.0 / total) / 10.0))
                .toList();
    }
}
