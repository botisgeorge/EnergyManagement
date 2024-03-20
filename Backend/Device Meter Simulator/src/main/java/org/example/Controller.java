package org.example;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;


public class Controller {

    private RabbitTemplate rabbitTemplate;
    private boolean isRunning = false;
    private Model m_model;
    private View m_view;

    Controller(Model model, View view, RabbitTemplate rabbitTemplate) {
        m_model = model;
        m_view = view;
        this.rabbitTemplate = rabbitTemplate;

        view.addActionListener(new AddListener());
        view.addStopListener(new StopListener());
    }

    class AddListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            if (!isRunning) {
                isRunning = true;
                new Thread(() -> {
                    while (isRunning) {
                        int time = 1;
                        if(m_view.getTimer().isBlank()) { time = 1; }
                        else time = Integer.parseInt(m_view.getTimer());
                        String deviceId = m_view.getDeviceId();

                        m_model.startTimer(time).thenAccept(result -> {
                            m_view.setValue(result);
                            LocalDateTime currentTime = LocalDateTime.now();
                            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                            String formattedTime = currentTime.format(formatter);
                            m_view.setTime(formattedTime);

                            // Send the message to RabbitMQ
                            sendMessage(deviceId, Double.parseDouble(result), currentTime);
                        });

                        try {
                            if(time > 0)
                                Thread.sleep(time*1000);
                            else Thread.sleep(1000);
                        } catch (InterruptedException ex) {
                            ex.printStackTrace();
                        }
                    }
                }).start();
            }
        }

        private void sendMessage(String deviceId, double measurementValue, LocalDateTime timestamp) {
            try {
                String jsonMessage = String.format("{\"timestamp\": %d, \"device_id\": \"%s\", \"measurement_value\": %.1f}",
                        timestamp.toInstant(ZoneOffset.UTC).toEpochMilli(), deviceId, measurementValue);

                System.out.println("Sending message: " + jsonMessage);

                rabbitTemplate.convertAndSend("EnergyData", jsonMessage);

                System.out.println("Message sent successfully.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    class StopListener implements ActionListener {
        public void actionPerformed(ActionEvent e) {
            isRunning = false;
            m_model.stopTimer();
        }
    }
}