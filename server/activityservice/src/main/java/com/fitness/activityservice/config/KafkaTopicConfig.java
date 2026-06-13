package com.fitness.activityservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String ACTIVITY_EVENTS_TOPIC = "activity-events";

    @Bean
    public NewTopic activityEventsTopic() {
        return TopicBuilder.name(ACTIVITY_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}