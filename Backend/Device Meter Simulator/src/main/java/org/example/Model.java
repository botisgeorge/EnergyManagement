package org.example;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Random;
import java.util.Timer;
import java.util.concurrent.*;

public class Model {

    private ScheduledFuture<?> scheduledFuture;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    public CompletableFuture<String> startTimer(int timerInterval) {
        CompletableFuture<String> futureResult = new CompletableFuture<>();

        executorService.submit(() -> {
            scheduledFuture = Executors.newSingleThreadScheduledExecutor().schedule(() -> {
                String readResult = readRandomRowAndUpdateView();
                futureResult.complete(readResult);
            }, timerInterval, TimeUnit.SECONDS);
        });

        return futureResult;
    }

    public void stopTimer() {
        if (scheduledFuture != null && !scheduledFuture.isDone()) {
            scheduledFuture.cancel(true);
        }
    }

    public String readRandomRowAndUpdateView() {
        String randomValue = getRandomValueFromCSV("C:\\Users\\Ebato\\Desktop\\Facultate\\SD\\Tema\\Backend\\sensor.csv");
        return randomValue;
    }

    private String getRandomValueFromCSV(String filePath) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            long lineCount = reader.lines().count();

            Random random = new Random();
            int randomLineNumber = random.nextInt((int) lineCount) + 1;
            //System.out.println(randomLineNumber);

            return readLineFromCSV(filePath, randomLineNumber);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error: Unable to read from CSV";
    }

    private String readLineFromCSV(String filePath, int lineNumber) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            int currentLine = 1;
            while ((line = reader.readLine()) != null) {
                if (currentLine == lineNumber) {
                    return line;
                }
                currentLine++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "Error: Unable to read line from CSV";
    }
}