package org.example;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionListener;

class View extends JFrame {

    private JTextField tf_value = new JTextField(10);
    private JTextField tf_time = new JTextField(10);
    private JTextField tf_deviceId = new JTextField(10);
    private JTextField tf_setTimer = new JTextField(10);
    private JLabel l_value = new JLabel("Value");
    private JLabel l_time = new JLabel("Time");
    private JLabel l_deviceId = new JLabel("Device ID");
    private JLabel l_timer = new JLabel("Set timer (seconds)");
    private JButton button_start = new JButton("Start");
    private JButton button_stop = new JButton("Stop");

    View()
    {
        JPanel panel1 = new JPanel(new GridLayout(2,1));
        panel1.add(l_value);
        panel1.add(tf_value);

        JPanel panel2 = new JPanel(new GridLayout(2,1));
        panel2.add(l_deviceId);
        panel2.add(tf_deviceId);

        JPanel panel3 = new JPanel(new GridLayout(2,1));
        panel3.add(l_time);
        panel3.add(tf_time);

        JPanel panel4 = new JPanel(new GridLayout(1,2));
        panel4.add(button_start);
        panel4.add(button_stop);


        JPanel panelSUS = new JPanel(new GridLayout(3,1));
        panelSUS.add(panel1);
        panelSUS.add(panel2);
        panelSUS.add(panel3);

        JPanel panelJOS = new JPanel(new GridLayout(3,1));
        panelJOS.add(l_timer);
        panelJOS.add(tf_setTimer);
        panelJOS.add(panel4);


        JPanel content = new JPanel(new BorderLayout());
        content.add(panelSUS,BorderLayout.NORTH);
        content.add(panelJOS,BorderLayout.SOUTH);
        content.setBorder(new EmptyBorder(20,70,20,70));

        this.setContentPane(content);
        this.pack();

        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        this.setLocation(dimension.width / 2 - this.getSize().width / 2,
                dimension.height / 2 - this.getSize().height / 2);

        this.setTitle("Device Monitor");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
    String getDeviceId()
    {
        return tf_deviceId.getText();
    }
    String getTimer()
    {
        return tf_setTimer.getText();
    }
    void setValue(String value){tf_value.setText(value);}
    void setTime(String time){tf_time.setText(time);}
    void addActionListener(ActionListener mal) {
        button_start.addActionListener(mal);
    }

    void addStopListener(ActionListener mal) {
        button_stop.addActionListener(mal);
    }
}