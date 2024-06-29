package com.hakim.chat.pojo;

public record ChatMessage(
        String message,
        String sender,
        MessageType type) {

}
