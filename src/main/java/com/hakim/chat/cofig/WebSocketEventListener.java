package com.hakim.chat.cofig;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.hakim.chat.pojo.ChatMessage;
import com.hakim.chat.pojo.MessageType;

@Configuration
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messageTemplate;

    public WebSocketEventListener(SimpMessageSendingOperations messageSendingOperations) {
        this.messageTemplate = messageSendingOperations;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        var headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        var username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            System.out.println("User " + username + " is disconnected.");
            var message = new ChatMessage("I am disconnected.", username, MessageType.LEAVE);
            messageTemplate.convertAndSend("/topic/public", message);
        }
    }

}
