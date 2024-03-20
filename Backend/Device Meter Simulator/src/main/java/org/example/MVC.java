package org.example;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MVC {
    public static void main(String[] args) {

        RabbitMQConfig rabbitMQConfig = new RabbitMQConfig();
        RabbitTemplate rabbitTemplate = rabbitMQConfig.rabbitTemplate(rabbitMQConfig.connectionFactory());

        View view = new View();
        Model model = new Model();
        Controller controller = new Controller(model, view, rabbitTemplate);
        view.setVisible(true);
    }
}
