package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.dto.AnalyticsDto.StreakDto;
import com.fitness.activityservice.dto.AnalyticsDto.SummaryDto;
import com.fitness.activityservice.dto.AnalyticsDto.TypeBreakdownDto;
import com.fitness.activityservice.dto.AnalyticsDto.WeeklyVolumeDto;
import com.fitness.activityservice.service.ActivityService;
import com.fitness.activityservice.service.AnalyticsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityService activityService;
    private AnalyticsService analyticsService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId) {
        request.setUserId(userId);
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-User-ID") String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivity(
            @PathVariable String activityId) {
        return ResponseEntity.ok(activityService.getActivityById(activityId));
    }

    // ─────────────────────── Analytics endpoints (Phase 8) ───────────────────────

    @GetMapping("/analytics/{userId}/streaks")
    public ResponseEntity<StreakDto> getStreaks(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getStreaks(userId));
    }

    @GetMapping("/analytics/{userId}/weekly-volume")
    public ResponseEntity<List<WeeklyVolumeDto>> getWeeklyVolume(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(analyticsService.getWeeklyVolume(userId, from, to));
    }

    @GetMapping("/analytics/{userId}/summary")
    public ResponseEntity<SummaryDto> getSummary(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getSummary(userId));
    }

    @GetMapping("/analytics/{userId}/type-breakdown")
    public ResponseEntity<List<TypeBreakdownDto>> getTypeBreakdown(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.getTypeBreakdown(userId));
    }
}
