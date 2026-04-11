---
title: Final Exam Preparation for Java - AWT
date: "2022-12-11T00:00:00Z"
description: "Java AWT"
tags: ["language"]
---

In the final scope of the Java language course, AWT (Abstract Window Toolkit) is covered. This document summarizes the study materials briefly.

# 1. Introduction

Java provides a package called AWT for GUI programming.

```java
import java.awt.*;
```

Let's explore the fundamental components.

## 1.1 Frame

A Frame provides a window for various applications. All components must be placed on top of the Frame, and at least one Frame is required. Every GUI program follows this process:

1. Create a Frame using `new Frame()`.
2. Set the frame size using the `setSize` method.
3. Make the frame visible on the screen using the `setVisible` method.

A simple program can be written as follows:

```java
import java.awt.*;

public class Main {
    public static void main(String[] args) {
        Frame f = new Frame("my Frame");
        f.setSize(300, 200);
        f.setVisible(true);
    }
}
```

## 1.2 Paint

The `paint` method is called when the Frame is displayed on the screen. The `paint` method is defined as follows and is executed in the following cases:

1. When the Frame is first displayed or its size is changed using `setSize`.
2. When the `repaint` method is called.
3. When the `show` method is called.

Typically, it is declared as:

```java
public void paint(Graphics g){
  ...
}
```

This is because the `Graphics` class is the abstract base class for all graphic objects, containing all the settings and methods needed for drawing. Therefore, the `paint` method receives a `Graphics` object as an argument to perform the drawing.

## 1.3 Window Destroyer

In the previous example, there is no way to close the Frame. Let's explore how to close it.

First, declare a class as follows:

```java
class WindowDestroyer extends WindowAdapter {
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
}
```

Then, add this listener to the Frame `f`.

```java
public class Main {
    public static void main(String[] args) {
        Frame f = new Frame("my Frame");
        f.setSize(300, 200);
        WindowDestroyer listener = new WindowDestroyer();
        f.addWindowListener(listener);
        f.setVisible(true);
    }
}
```

# 2. Methods for Drawing Shapes

Let’s review methods for drawing basic shapes.

## 2.1 Frame Constructor

```java
Frame f = new Frame(window title);
```

The constructor of the Frame class initializes the frame using the string passed as a constructor argument and a `GraphicsConfiguration` object, which contains information about the graphics environment. However, this is typically not configured by the user, so only the window title is passed as a constructor argument.

## 2.2 setSize

This method sets the size of the component and is used as follows:

```java
f.setSize(width, height);
```

## 2.3 setVisible

If the argument is `true`, the component is displayed on the screen; if `false`, it is hidden.

```java
f.setVisible(true);
f.setVisible(false);
```

## 2.4 drawRect

The `drawRect` method is used to draw a rectangle and has the following signature:

```java
public void drawRect(int x, int y, int width, int height)
```

Here, `x` and `y` are the coordinates of the `top-left` corner of the rectangle, and `width` and `height` are the width and height of the rectangle.

## 2.5 fillRect

The `fillRect` method fills a rectangle and is defined as follows:

```java
public void fillRect(int x, int y, int width, int height)
```

The fill color of the rectangle is defined by the `setColor` method. The default color is black.

## 2.6 drawRoundRect

The `drawRoundRect` method draws a rectangle with rounded corners, defined as follows:

```java
public void drawRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight)
```

Here, `x` and `y` are the coordinates of the `top-left` corner of the rectangle, `width` and `height` are the width and height, while `arcWidth` and `arcHeight` indicate the degree of rounding at the corners. `arcWidth` represents the rounded width, and `arcHeight` represents the rounded height.

## 2.7 fillRoundRect

The `fillRoundRect` method draws a rectangle with rounded corners filled with the color set by `setColor`, defined as follows:

```java
public void fillRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight)
```

Its structure is similar to `drawRoundRect`.

## 2.8 DrawLine

This method draws a line from point `(x1, y1)` to point `(x2, y2)`.

```java
public void drawLine(int x1, int y1, int x2, int y2)
```

## 2.9 DrawOval

The `drawOval` method is used to draw an oval and is defined as:

```java
public void drawOval(int x, int y, int width, int height)
```

In this method, `x` and `y` are **not** the center of the oval; they are the coordinates of the `top-left` corner of the rectangle that perfectly bounds the oval, while `width` and `height` are the dimensions of that rectangle.

Consider the following code:

```java
import java.awt.*;
import java.awt.event.*;

class WindowDestroyer extends WindowAdapter {
    public void windowClosing(WindowEvent e) {
        System.exit(0);
    }
}

public class Main extends Frame {
    public Main(String str) {
        super(str);
    }

    public void paint(Graphics g) {
        g.drawLine(50, 50, 200, 200);
        g.drawOval(50, 50, 50, 30);
    }

    public static void main(String[] args) {
        Frame f = new Main("my Frame");
        f.setSize(500, 300);
        WindowDestroyer listener = new WindowDestroyer();
        f.addWindowListener(listener);
        f.setVisible(true);
    }
}
```

The result is as follows:

![oval](./drawOval.png)

You can see that the starting point of the line `(50, 50)` is the `top-left` corner of the bounding rectangle for the oval, not its center.

## 2.10 FillOval

The `fillOval` method draws an oval filled with the color set by `setColor` (default is black) and has the same structure as `drawOval`.

```java
public void fillOval(int x, int y, int width, int height)
```

## 2.11 DrawArc

The `drawArc` method draws an arc and is defined as follows:

```java
public void drawArc(int x, int y, int width, int height, int startAngle, int arcAngle)
```

Here, `x` and `y` are coordinates of the `top-left` corner of the bounding rectangle for the arc, while `width` and `height` are the dimensions of that rectangle. `startAngle` is the starting angle of the arc, and `arcAngle` is the extent of the arc. The angle is measured from the positive x-axis in a clockwise direction. 

The example is more intuitive with `fillArc`.

## 2.12 FillArc

The `fillArc` method draws an arc filled with the color set by `setColor` (default is black) and follows the structure of `drawArc`.

```java
public void fillArc(int x, int y, int width, int height, int startAngle, int arcAngle)
```

Consider the following `paint` function:

```java
public void paint(Graphics g) {
    g.drawLine(50, 50, 200, 200);
    g.fillArc(50, 50, 100, 70, 60, 200);
}
```

In this case, the `top-left` corner of the bounding rectangle for the arc is `(50, 50)`, starting from 60 degrees with a central angle of 200 degrees.

![fillArc](./fillArc.png)

## 2.13 DrawPolygon

This method draws a polygon. Arrays `x` and `y` store coordinates of each vertex, and `n` is the number of vertices.

```java
public void drawPolygon(int[] x, int[] y, int n)
```

It connects points `(x[i-1], y[i-1])` to `(x[i], y[i])` linearly for `n` points.

For example, create the following `paint` function:

```java
public void paint(Graphics g) {
    g.drawLine(50, 50, 200, 200);
    int x[] = {50, 100, 100, 50};
    int y[] = {50, 50, 100, 100};
    g.drawPolygon(x, y, 4);
}
```

This will produce the following shape:

![p1](./polygon-1.png)

If the number of vertices is changed? Only the first `n` elements of the arrays `x` and `y` will be used.

```java
public void paint(Graphics g) {
    g.drawLine(50, 50, 200, 200);
    int x[] = {50, 100, 100, 50};
    int y[] = {50, 50, 100, 100};
    g.drawPolygon(x, y, 3);
}
```

Setting three vertices produces the following result:

![p2](./polygon-2.png)

If the number of specified vertices exceeds the size of the arrays `x` and `y`, an error will occur, such as attempting to specify 5 when the size is 4.

## 2.14 FillPolygon

This method draws a polygon filled with color and has the same structure as `drawPolygon`.

```java
public void fillPolygon(int[] x, int[] y, int n)
```

# 3. Methods for Drawing Strings

## 3.1 DrawString

This method is used to draw a string. The position of the string is at the `bottom-left` corner of the string itself.

```java
public void drawString(String str, int x, int y)
```

For instance, using the following `paint` function:

```java
public void paint(Graphics g) {
    g.drawLine(50, 50, 200, 200);
    g.drawString("I am a witch", 50, 50);
}
```

This will yield the following result:

![drawString](./drawString.png)

## 3.2 SetFont

This method sets the font used to draw strings.

```java
public void setFont(Font f)
```

Since `setFont` is a method of the Graphics class, it can be used as `g.setFont(new Font("Serif", Font.BOLD, 20))`.

The Font class represents fonts. The constructor for the Font class is as follows:

```java
public Font(String name, int style, int size)
```

Here, `name` is the font name, `style` is the font style, and `size` is the font size. The style uses these constants:

```java
Font.PLAIN
Font.BOLD
Font.ITALIC
Font.BOLD + Font.ITALIC
```

Names such as "Serif" and "Sans" can be used as shown above.

# 4. Methods for Drawing Images

## 4.1 GetImage

This method retrieves an image based on the file location. It is used via `getDefaultToolkit()`.

```java
Image img = Toolkit.getDefaultToolkit().getImage("image path");
```

## 4.2 DrawImage

This method is used for drawing images.

```java
public boolean drawImage(Image img, int x, int y, ImageObserver observer)
```

Often `this` is used as the observer. `x` and `y` determine the `top-left` corner of the image.

Alternatively, it can be used as follows:

```java
public boolean drawImage(Image img, int x, int y, int width, int height, ImageObserver observer)
```

Here, `this` is also the observer. `width` and `height` represent the dimensions of the image.

This can be utilized as shown below:

```java
public void paint(Graphics g) {
    g.drawLine(50, 50, 200, 200);
    Image img = Toolkit.getDefaultToolkit().getImage("/Users/kimsunghyun/IdeaProjects/study/src/witch.jpeg");
    g.drawImage(img, 50, 50, 100, 100, this);
}
```

This results in my profile picture, as illustrated below. Comparing the position of the line, you can see that `x` and `y` are indeed the `top-left` corner of the image.

![drawImage](./drawImage.png)

# 5. Size Related Methods

## 5.1 GetSize

This method returns the size of the frame.

```java
public Dimension getSize()
```

## 5.2 GetInsets

This method returns the size of the frame's borders, containing values for bottom, left, right, and top.

```java
public Insets getInsets()
```

## 5.3 Usage

```java
public void paint(Graphics g) {
    Dimension d = getSize();
    Insets in = getInsets();
    g.drawString("d.width  : " + d.width, 10, 40);
    g.drawString("d.height : " + d.height, 10, 60);
    g.drawString("in.left  : " + in.left, 10, 80);
    g.drawString("in.right : " + in.right, 10, 100);
    g.drawString("in.top   : " + in.top, 10, 120);
    g.drawString("in.bottom: " + in.bottom, 10, 140);
}
```

This way, you can determine the sizes of the frame and borders. The result on my computer is as follows.

![getSize](./size.png)

# 6. Color Related Methods

## 6.1 SetColor, SetBackground

These methods determine the color of shapes and the background.

```java
public void setColor(Color c)
public void setBackground(Color c)
```

`setColor` is a method of the Graphics class, so it can be used as `g.setColor(Color.pink)`. `setBackground` is a method of the Frame class, allowing for use as `f.setBackground(Color.red)` or within the Frame class context as `setBackground(Color.red)`.

The Color class represents colors. The constructor for the Color class is as follows:

```java
public Color(int r, int g, int b)
```

It constructs a color from values of `r`, `g`, and `b`, each ranging from 0 to 255.

## 6.2 GetXORMode

This method alternates the current color of the graphic context with the newly specified color. In XOR mode, the pixels alternate between the current color and the newly specified XOR alternate color.

```java
public void paint(Graphics g) {
    g.setColor(Color.pink);
    g.fillRect(10, 10, 200, 100);
    g.setXORMode(Color.blue);
    g.fillRect(100, 50, 200, 100);
}
```

## 6.3 Usage - Moving Drawings

Using XOR mode, a drawing can be erased and redrawn, creating the appearance of movement. By drawing a picture at a specific position, waiting briefly, erasing the displayed picture, then redrawing at a slightly shifted new position, the image appears to move right.

```java
public void paint(Graphics g) {
    Image img = Toolkit.getDefaultToolkit().getImage("/Users/kimsunghyun/IdeaProjects/study/src/HAEMA.GIF");
    Dimension d = getSize();
    int x;
    g.setXORMode(Color.white);
    for (x = 10; x < d.width - 100; x += 10) { // move haema to right direction
        g.drawImage(img, x, 30, 100, 200, this); // draw haema
        for (int j = 0; j < 30000; j++);
        g.drawImage(img, x, 30, 100, 200, this); // delete haema drawn
    }
    g.drawImage(img, x, 30, 100, 200, this);
}
```

# 7. Panel

A Panel acts as a container within a Frame, effectively inheriting from `java.awt.Container`. Components can be added using the `add` method, and methods like `setSize`, `setLocation`, and `setBackground` are applicable.

After creating a Frame, it can incorporate Panels using its `add` method. The following demonstrates adding a yellow panel to a pink frame:

```java
public static void main(String[] args) {
    Frame f = new Main("my Frame");
    Panel p = new Panel();
    f.setSize(500, 300);
    f.setBackground(Color.pink);
    f.setLayout(null);
    p.setSize(100, 100);
    p.setBackground(Color.yellow);
    f.add(p);
    f.addWindowListener(new WindowDestroyer());
    f.setVisible(true);
}
```

# 8. Layouts

The previously mentioned `setLayout(null);` indicates that no layout manager will be used. Other layout managers include:

## 8.1 FlowLayout

This arranges components from left to right by default, centered. If a component’s size exceeds that of the Frame, it wraps to the next line. It uses components' preferred sizes, which can be modified using the constructor.

```java
f.setLayout(new FlowLayout());
```

The constructor parameter can define the alignment: `FlowLayout.LEFT`, `FlowLayout.RIGHT`, or `FlowLayout.CENTER`.

Additionally, the `pack()` method adjusts the Frame's size to accommodate the components it contains.

## 8.2 BorderLayout

This is the default layout for Frames and dialogs. It divides the Frame into five areas—NORTH, SOUTH, EAST, WEST, and CENTER. When placing components, the position can be set as the second argument of the `add` method.

```java
f.setLayout(new BorderLayout());
```

This can also define the spacing between components via constructor parameters:

```java
f.setLayout(new BorderLayout(hgap, vgap));
```

Usage with the Frame's `add` method is as follows:

```java
f.add(btn1, BorderLayout.NORTH);
f.add(btn2, BorderLayout.SOUTH);
f.add(btn3, BorderLayout.EAST);
f.add(btn4, BorderLayout.WEST);
f.add(btn5, BorderLayout.CENTER);
```

## 8.3 GridLayout

This layout arranges components into rows and columns. Think of it as dividing the frame into a grid to place components sequentially from top to bottom and left to right. Various parameters can be specified in the constructor.

```java
setLayout(new GridLayout());
setLayout(new GridLayout(rows, cols));
setLayout(new GridLayout(rows, cols, hgap, vgap));
```

The `add` method arranges components automatically.

## 8.4 CardLayout

This layout allows multiple screens to be viewed in a slide-like manner. One can add multiple screens to the layout and show desired containers sequentially.

To show a specified screen, supply it as a parameter to the `show` method:

```java
public static void main(String[] args) {
    Frame f = new Main("my Frame");
    CardLayout card = new CardLayout();
    f.setLayout(card);
    Panel p1 = new Panel();
    p1.setBackground(Color.pink);
    Panel p2 = new Panel();
    p2.setBackground(Color.yellow);
    Panel p3 = new Panel();
    p3.setBackground(Color.CYAN);
    f.add(p1, "1");
    f.add(p2, "2");
    f.add(p3, "3");

    class Handler extends MouseAdapter {
        public void mouseClicked(MouseEvent e) {
            card.next(f);
        }
    }

    p1.addMouseListener(new Handler());
    p2.addMouseListener(new Handler());
    p3.addMouseListener(new Handler());
    f.addWindowListener(new WindowDestroyer());
    f.setSize(500, 300);
    f.setVisible(true);
    card.show(f, "1");
}
```