package com.example.application.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.BrowserCallable;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.service.TokenStream;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Service
@BrowserCallable
@AnonymousAllowed
public class ChatService {

    @Value("${api-key.openai}")
    private String OPENAI_API_KEY;

    private Assistant assistant;
    private StreamingAssistant streamingAssistant;

    @PostConstruct
    void init() {
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);

        ChatLanguageModel model = OpenAiChatModel
                .builder()
                .apiKey(OPENAI_API_KEY)
                .build();

        assistant = AiServices.builder(Assistant.class)
                .chatLanguageModel(model)
                .chatMemory(chatMemory)
                .build();

        streamingAssistant = AiServices.builder(StreamingAssistant.class)
                .streamingChatLanguageModel(OpenAiStreamingChatModel.withApiKey(OPENAI_API_KEY))
                .chatMemory(chatMemory)
                .build();
    }

    public String chat(String message) {
        return assistant.chat(message);
    }

    public Flux<String> chatStream(String message) {
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        streamingAssistant.chat(message).onNext(sink::tryEmitNext)
                .onComplete(sink::tryEmitComplete)
                .onError(sink::tryEmitError)
                .start();

        return sink.asFlux();
    }

    interface Assistant {
        String chat(String message);
    }

    interface StreamingAssistant {
        TokenStream chat(String message);
    }
}
