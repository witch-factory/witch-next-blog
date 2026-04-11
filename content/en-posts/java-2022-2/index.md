---
title: Final Exam Preparation Java - Windows Programming
date: "2022-12-13T00:00:00Z"
description: "Java Windows Programming"
tags: ["language"]
---

This document summarizes the 6th topic for the Java final exam, focusing on Windows Programming. It covers various events and components.

# 1. Events

An object that contains information about what happened. For example, it contains details such as when the mouse is clicked, which key is pressed on the keyboard, and the cursor position. In Java, this is referred to as `ActionEvent`.

## 1.1 ActionEvent

The ActionEvent object includes the following methods:

- `String getActionCommand()`: Returns the text of the component where the event occurred.
- `getModifiers()`: Returns the keyboard modifiers for the component where the event occurred.

## 1.2 Event Handler

An event handler receives, decodes, and processes the event object.

Events are passed to the component that receives them, which holds an event listener object that can process events. The code is structured to handle events at the component level.

For example, an event listener can be written as follows. In addition to actionPerformed, there are various event listeners such as MouseListener and mousePressed, among others. Handlers are created by implementing these abstract listener classes.

```java
class ButtonHandler implements ActionListener {
    public void actionPerformed(ActionEvent e) {
        System.out.println("Button Pressed");
        System.out.println("Button label: " + e.getActionCommand());
    }
}
```

To register this event listener with a component, use the addActionListener method.

```java
public static void main(String[] args) {
    Frame f = new Main("my Frame");
    Button b = new Button("Press me");
    b.addActionListener(new ButtonHandler());
    f.add(b, BorderLayout.CENTER);
    f.pack();
    f.setVisible(true);
}
```

By adding an event listener to the button, click events are processed.

## 1.3 Multiple Event Handlers

It is also possible to attach multiple event handlers to a single component. Different handlers are used for different events by utilizing various add listener methods.

Note that all methods of the implemented abstract base class must be defined.

```java
public class Main implements MouseMotionListener, MouseListener {
    private TextField tf;
    private Frame f;

    public Main() {
        f = new Frame("two listeners");
        f.add(new Label("Mouse Drag"), BorderLayout.NORTH);
        tf = new TextField(30);
        f.add(tf, BorderLayout.SOUTH);
        f.addMouseMotionListener(this);
        f.addMouseListener(this);
        f.setSize(500, 300);
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public void paint(Graphics g) {
    }

    public static void main(String[] args) {
        Main M = new Main();
    }

    public void mouseDragged(MouseEvent e) {
        String s = "Mouse drag X: " + e.getX() + " Y:" + e.getY();
        tf.setText(s);
    }
    
    public void mouseEntered(MouseEvent e) {
        tf.setText("Mouse Entered");
    }
    
    public void mouseExited(MouseEvent e) {
        tf.setText("Mouse Exited");
    }
    
    public void mouseMoved(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
    public void mouseClicked(MouseEvent e) {}
    public void mousePressed(MouseEvent e) {}
}
```

# 2. AWT Components

## 2.1 Button

```java
class ButtonHandler implements ActionListener {
    public void actionPerformed(ActionEvent e) {
        System.out.println("Button Pressed");
        System.out.println("Button label: " + e.getActionCommand());
    }
}

public class Main {
    Main() {
        Frame f = new Frame("Example Program");
        Button b = new Button("Example Button");
        b.addActionListener(new ButtonHandler());
        f.add(b);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public static void main(String args[]) {
        Main M = new Main();
    }
}
```

Used the actionPerformed method from ActionListener.

## 2.2 Checkbox

There are five constructors:

```java
new Checkbox(); // Creates a checkbox with no label and not selected
new Checkbox(String label);
new Checkbox(String label, boolean state);
new Checkbox(String label, boolean state, CheckboxGroup group);
new Checkbox(String label, CheckboxGroup group, boolean state);
```

You can use ItemListener's itemStateChanged. This method is called when the state of the checkbox changes.

The following code creates three checkboxes labeled One, Two, and Three, and prints the state whenever it changes.

```java
class CheckboxHandler implements ItemListener {
    public void itemStateChanged(ItemEvent e) {
        String state = "deselected";
        if (e.getStateChange() == ItemEvent.SELECTED) {
            state = "selected";
        }
        System.out.println(e.getItem() + " " + state);
    }
}

public class Main {
    Main() {
        Frame f = new Frame("Example Program");
        Checkbox cb1 = new Checkbox("One", true);
        Checkbox cb2 = new Checkbox("Two", false);
        Checkbox cb3 = new Checkbox("Three", false);
        cb1.addItemListener(new CheckboxHandler());
        cb2.addItemListener(new CheckboxHandler());
        cb3.addItemListener(new CheckboxHandler());
        f.setLayout(new FlowLayout());
        f.add(cb1);
        f.add(cb2);
        f.add(cb3);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public static void main(String args[]) {
        Main M = new Main();
    }
}
```

CheckboxGroup can also be created with `new CheckboxGroup()`. When passed to the Checkbox constructor, it assigns the checkbox to that group.

## 2.3 Choice

Choice allows the creation of a dropdown menu from which one can select an item.

```java
Choice ch = new Choice();
ch.addItem("First");
ch.addItem("Second");
ch.addItem("Third");
```

Choice can utilize ItemListener's itemStateChanged, which is called when its state changes.

## 2.4 Canvas

Canvas is a component that allows for drawing. You can draw by overriding the paint() method.

The following example uses KeyListener's keyTyped method to change the canvas's color every time a key is pressed.

```java
public class Main extends Canvas implements KeyListener {
    private int idx;
    Color colors[] = { Color.red, Color.green, Color.blue };

    Main() {
        super();
    }

    public void paint(Graphics g) {
        g.setColor(colors[idx]);
        g.fillRect(0, 0, getSize().width, getSize().height);
    }

    public void keyTyped(KeyEvent e) {
        idx = (idx + 1) % colors.length;
        repaint();
    }

    public void keyPressed(KeyEvent e) {}
    public void keyReleased(KeyEvent e) {}

    public static void main(String args[]) {
        Frame f = new Frame("Canvas Example");
        Main m = new Main();
        m.setSize(150, 150);
        f.add(m, BorderLayout.CENTER);
        m.requestFocus();
        m.addKeyListener(m);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }
}
```

## 2.5 TextArea

TextArea is a component for entering multiple lines of text. Its constructors are as follows:

```java
new TextArea();
new TextArea(int rows, int cols);
new TextArea(String text);
new TextArea(String text, int rows, int cols);
// scrollbar determines the presence of a scrollbar
new TextArea(String text, int rows, int cols, int scrollbars);
```

You can use TextListener's textValueChanged, which is called when the text in the TextArea changes.

## 2.6 TextField

A component for entering a single line of text. Its constructors include:

```java
new TextField();
new TextField(int cols);
new TextField(String text);
new TextField(String text, int cols);
```

You can use TextListener's textValueChanged, which is called when the text in the TextField changes.

Furthermore, to receive key inputs, you can use KeyAdapter, a class implementing KeyListener.

## 2.7 List

List is a component that allows selecting multiple items. You can scroll through several elements and select one or multiple items.

```java
new List();
new List(int rows);
// multiple determines whether multiple items can be selected.
new List(int rows, boolean multiple);
```

It is used as follows:

```java
public class Main {
    private Frame f;
    private List l;

    public Main() {
        f = new Frame("List Sample");
        l = new List(4, true);
        l.add("A");
        l.add("B");
        l.add("C");
        l.add("D");
        f.add(l, BorderLayout.CENTER);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public static void main(String args[]) {
        Main M = new Main();
    }
}
```

## 2.8 Dialog

Dialog is a component that appears on top of other components. You can create a Dialog using methods from Frame.

The visibility of a dialog can change depending on the state of the frame it belongs to or other dialogs. If the frame containing the dialog is closed, the dialog will also not be displayed.

WindowListener's event methods such as windowOpened, windowClosing, windowClosed, windowActivated, and windowDeactivated can be utilized.

Constructors include:

```java
new Dialog(Dialog owner);
new Dialog(Dialog owner, String title);
new Dialog(Dialog owner, String title, boolean modal);
new Dialog(Frame owner);
new Dialog(Frame owner, boolean modal);
new Dialog(Frame owner, String title);
new Dialog(Frame owner, String title, boolean modal);
```

You can also close the dialog using the dispose method, and handle events when a button in the dialog is pressed using ActionListener's actionPerformed.

## 2.9 FileDialog

FileDialog allows you to choose a file. Its constructors are:

```java
new FileDialog(Frame owner);
new FileDialog(Frame owner, String title);
new FileDialog(Frame owner, String title, int mode);
```

The modes are as follows: FileDialog.LOAD for loading a file, and FileDialog.SAVE for saving a file.

## 2.10 Menu

Menu structure: MenuBar -> Menu -> MenuItem.

A menu bar can be added using Frame's setMenuBar.

```java
MenuBar mb = new MenuBar();
Menu fileMenu = new Menu("File");
fileMenu.add(new MenuItem("Open"));
fileMenu.add(new MenuItem("Save"));
fileMenu.addSeparator(); // Insert separator
fileMenu.add(new MenuItem("Exit"));
mb.add(fileMenu);
f.setMenuBar(mb);
```

Checkboxes can also be added to the menu using CheckboxMenuItem.