package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.UserContext;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final RecommendationRepository recommendationRepository;

    public Recommendation generateRecommendation(Activity activity) {
        // 1. Fetch all past recommendations for this user to compute context
        List<Recommendation> pastRecs = recommendationRepository.findByUserId(activity.getUserId());

        // 2. Build lightweight UserContext (streak + PRs derived from saved recommendations)
        UserContext userContext = buildUserContext(pastRecs);

        // 3. Use the richer, context-aware prompt
        String prompt = buildContextualPrompt(userContext, activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("AI response for activity {}: {}", activity.getId(), aiResponse);

        return processAiResponse(activity, aiResponse);
    }

    private UserContext buildUserContext(List<Recommendation> pastRecs) {
        int totalSessions = pastRecs.size();

        // Derive personal records: group by activityType (String), keep the first
        // line of the stored recommendation text for the best (highest-calorie stub)
        // entry per type.
        Map<String, String> personalRecords = pastRecs.stream()
                .collect(Collectors.groupingBy(
                        Recommendation::getActivityType,
                        Collectors.collectingAndThen(
                                Collectors.maxBy(
                                        Comparator.comparingInt(
                                                (Recommendation r) -> parseCaloriesFromRec(r.getRecommendation())
                                        )
                                ),
                                opt -> opt
                                        .map(r -> r.getRecommendation().lines().findFirst().orElse(""))
                                        .orElse("No PR yet")
                        )
                ));

        return UserContext.builder()
                .currentStreak(0)
                .totalSessions(totalSessions)
                .personalRecords(personalRecords)
                .previousActivity(null)
                .build();
    }

    @SuppressWarnings("unused")
    private int parseCaloriesFromRec(String recommendationText) {
        // TODO: replace with a proper numeric field once the data model is richer
        return 0;
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode
                    .path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text");

            String jsonContent = textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            JsonNode analysisJson = mapper.readTree(jsonContent);
            JsonNode analysisNode = analysisJson.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI response for activity {}: {}", activity.getId(), e.getMessage(), e);
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness professional"))
                .safety(Arrays.asList("Always warm up before exercise", "Stay hydrated", "Listen to your body"))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> safety.add(item.asText()));
        }
        return safety.isEmpty()
                ? Collections.singletonList("Follow general safety guidelines")
                : safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty()
                ? Collections.singletonList("No specific suggestions provided")
                : suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty()
                ? Collections.singletonList("No specific improvements provided")
                : improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode,
                                    String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    public String buildContextualPrompt(UserContext userContext, Activity latestActivity) {
        String prForThisType = userContext.getPersonalRecords()
                .getOrDefault(latestActivity.getType(), "No PR recorded yet");

        String previousSessionSummary = "None";
        if (userContext.getPreviousActivity() != null) {
            Activity prev = userContext.getPreviousActivity();
            previousSessionSummary = String.format("%s — %d min, %d kcal",
                    prev.getType(), prev.getDuration(), prev.getCaloriesBurned());
        }

        return String.format("""
                        Analyze this fitness activity with the following user history and provide recommendations in the EXACT JSON format below.
                        
                        === User History ===
                        Current Streak    : %d consecutive days
                        Total Sessions    : %d lifetime sessions
                        PR for %s         : %s
                        Previous Session  : %s
                        
                        === Today's Activity ===
                        Activity Type     : %s
                        Duration          : %d minutes
                        Calories Burned   : %d
                        Additional Metrics: %s
                        
                        === Required JSON Response Format ===
                        {
                          "analysis": {
                            "overall": "...",
                            "pace": "...",
                            "heartRate": "...",
                            "caloriesBurned": "..."
                          },
                          "improvements": [
                            { "area": "...", "recommendation": "..." }
                          ],
                          "suggestions": [
                            { "workout": "...", "description": "..." }
                          ],
                          "safety": ["...", "..."]
                        }
                        
                        Instructions:
                        - Reference the user's streak and PR in the 'overall' analysis.
                        - If today beats the PR, celebrate it and suggest how to recover properly.
                        - If the streak is >= 7 days, include a rest-day recommendation in 'safety'.
                        - Provide exactly 3 improvements and 2 next-workout suggestions.
                        """,
                userContext.getCurrentStreak(),
                userContext.getTotalSessions(),
                latestActivity.getType(),
                prForThisType,
                previousSessionSummary,
                latestActivity.getType(),
                latestActivity.getDuration(),
                latestActivity.getCaloriesBurned(),
                latestActivity.getAdditionalMetrics());
    }
}
