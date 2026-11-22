package com.quentraa.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/** Publishes queue state changes to WebSocket subscribers. */
@Service
public class QueueEventService {

    private final SimpMessagingTemplate messagingTemplate;

    public QueueEventService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /** Notify all subscribers that a token's status changed. */
    public void publishTokenUpdate(String branchId, Object token) {
        messagingTemplate.convertAndSend("/topic/queue/" + branchId, token);
    }

    /** Notify public display of now-serving token. */
    public void publishNowServing(String branchId, Object token) {
        messagingTemplate.convertAndSend("/topic/queue/" + branchId + "/now-serving", token);
    }
}
