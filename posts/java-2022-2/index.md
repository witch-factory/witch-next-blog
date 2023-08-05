---
title: 기말고사 대비 java - Windows Programming
date: "2022-12-13T00:00:00Z"
description: "java Windows Programming"
tags: ["java"]
---

Java 기말고사 범위의 6번째, Windows Programming에 대해 정리해보았다. 각종 이벤트들과 컴포넌트들에 대해 알아본다.

# 1. 이벤트

무슨 일이 생겼는지를 담고 있는 객체이다. 가령 마우스가 클릭되었을 때, 키보드가 눌렸을 때 어떤 키가 눌렸고 커서 위치는 어디고 등등을 담고 있는 것이다. java에서는 이를 `ActionEvent`라고 한다.

## 1.1 ActionEvent

ActionEvent 객체는 다음과 같은 메서드를 포함한다.

- `String getActionCommand()`: 이벤트가 발생한 컴포넌트의 텍스트를 반환한다.
- `getModifiers()`: 이벤트가 발생한 컴포넌트의 키보드 모드를 반환한다.

## 1.2 이벤트 핸들러

이벤트 핸들러는 이벤트 객체를 받아서 해독하고 처리하는 역할을 한다.

이벤트는 그걸 받은 컴포넌트에 전달되는데 컴포넌트는 이벤트를 처리할 수 있는 이벤트 핸들러를 담은 객체인 이벤트 리스너를 가지고 있다. 이벤트를 리스너로 전달하는 것은 컴포넌트 단에서 처리하도록 코드를 짠다.

예를 들어서 이벤트 리스너는 다음과 같이 작성할 수 있다. actionPerformed 외에도 MouseListener와 mousePressed 등 다양한 이벤트 리스너와 그 메소드들이 있다. 그 이벤트 리스너 추상 클래스들을 구현하는 식으로 핸들러를 만든다.

```java
class ButtonHandler implements ActionListener{
    public void actionPerformed(ActionEvent e){
        System.out.println("Button Pressed");
        System.out.println("Button label : "+ e.getActionCommand());
    }
}
```

그리고 이 이벤트 리스너를 컴포넌트에 등록하는 것은 addActionListener 메서드를 사용한다.

```java
public static void main(String[] args) {
    Frame f=new Main("my Frame");
    Button b=new Button("Press me");
    b.addActionListener(new ButtonHandler());
    f.add(b, BorderLayout.CENTER);
    f.pack();
    f.setVisible(true);
}
```

버튼에 이벤트 리스너를 추가함으로써 클릭 이벤트를 처리할 수 있도록 한 것이다.

## 1.3 다중 이벤트 핸들러

하나의 컴포넌트에 여러 이벤트 핸들러를 다는 것도 가능하다. 서로 다른 이벤트에 대한 핸들러는 다른 add listener 메서드를 사용하기 때문이다.

이때 implements한 추상 베이스 클래스의 메서드를 모두 정의해 줘야 됨에 주의.

```java
public class Main implements MouseMotionListener, MouseListener{
    private TextField tf;
    private Frame f;
    public Main(){
        f=new Frame("two listeners");
        f.add(new Label("마우스 드래그"), BorderLayout.NORTH);
        tf=new TextField(30);
        f.add(tf, BorderLayout.SOUTH);
        f.addMouseMotionListener(this);
        f.addMouseListener(this);
        f.setSize(500,300);
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public void paint(Graphics g){
    }

    public static void main(String[] args) {
        Main M=new Main();
    }
    public void mouseDragged(MouseEvent e){
        String s="Mouse drag X:" + e.getX() + "Y:"+e.getY();
        tf.setText(s);
    }
    public void mouseEntered(MouseEvent e){
        tf.setText("Mouse Entered");
    }
    public void mouseExited(MouseEvent e){
        tf.setText("Mouse Exited");
    }
    public void mouseMoved(MouseEvent e) {}
    public void mouseReleased(MouseEvent e) {}
    public void mouseClicked(MouseEvent e) {}
    public void mousePressed(MouseEvent e) {}
}
```

# 2. AWT 컴포넌트

## 2.1 Button

```java
class ButtonHandler implements ActionListener{
    public void actionPerformed(ActionEvent e){
        System.out.println("Button Pressed");
        System.out.println("Button label : "+ e.getActionCommand());
    }
}
public class Main{
    Main(){
        Frame f=new Frame("예시 프로그램");
        Button b=new Button("예시 버튼");
        b.addActionListener(new ButtonHandler());
        f.add(b);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public static void main(String args[]){
        Main M=new Main();
    }
}
```

ActionListener의 actionPerformed를 사용하였다.

## 2.2 Checkbox

생성자는 5가지가 있다.

```java
new Checkbox(); // 라벨 없고, 선택되지 않은 상태로 생성된다
new Checkbox(String label);
new Checkbox(String label, boolean state);
new Checkbox(String label, boolean state, CheckboxGroup group);
new Checkbox(String label, CheckboxGroup group, boolean state);
```

ItemListener의 itemStateChanged를 사용할 수 있다. itemStateChanged는 체크박스의 상태가 변경될 때 호출된다.

다음 코드에선 One, Two, Three 라벨이 붙은 체크박스 3개를 생성하고 그 상태가 바뀔 때마다 그 상태를 출력한다.

```java

class CheckboxHandler implements ItemListener{
    public void itemStateChanged(ItemEvent e){
        String state="deselected";
        if(e.getStateChange()==ItemEvent.SELECTED){
            state="selected";
        }
        System.out.println(e.getItem() + " "+state);
    }
}
public class Main{
    Main(){
        Frame f=new Frame("예시 프로그램");
        Checkbox cb1=new Checkbox("One", true);
        Checkbox cb2=new Checkbox("Two", false);
        Checkbox cb3=new Checkbox("Three", false);
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

    public static void main(String args[]){
        Main M=new Main();
    }
}
```

CheckboxGroup도 `new CheckboxGroup()`로 생성할 수 있다. 이때 Checkbox의 생성자에 CheckboxGroup을 넣어주면 그 그룹에 속하게 된다.

## 2.3 Choice

Choice는 여러가지 중에 하나를 선택하는 드롭다운 메뉴를 만들 수 있다.

```java
Choice ch=new Choice();
ch.addItem("First");
ch.addItem("Second");
ch.addItem("Third");
```

Choice는 ItemListener의 itemStateChanged를 사용할 수 있다. itemStateChanged는 Choice의 상태가 변경될 때 호출된다.

## 2.4 Canvas

Canvas는 그림을 그릴 수 있는 컴포넌트이다. Canvas는 paint() 메소드를 오버라이드하여 그림을 그릴 수 있다.

다음 예제는 KeyListener의 keyTyped를 사용하여 키보드를 누를 때마다 캔버스 색이 바뀌는 프로그램이다.

```java
public class Main extends Canvas implements KeyListener{
    private int idx;
    Color colors[]={Color.red, Color.green, Color.blue};
    Main(){
        super();
    }

    public void paint(Graphics g){
        g.setColor(colors[idx]);
        g.fillRect(0,0,getSize().width, getSize().height);
    }

    public void keyTyped(KeyEvent e){
        idx=(idx+1)%colors.length;
        repaint();
    }

    public void keyPressed(KeyEvent e){}
    public void keyReleased(KeyEvent e){}

    public static void main(String args[]){
        Frame f=new Frame("캔버스 예시");
        Main m=new Main();
        m.setSize(150,150);
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

TextArea는 여러 줄의 텍스트를 입력할 수 있는 컴포넌트이다. 다음과 같은 생성자를 가진다.

```java
new TextArea();
new TextArea(int rows, int cols);
new TextArea(String text);
new TextArea(String text, int rows, int cols);
// scrollbar는 스크롤바 유무를 결정한다.
new TextArea(String text, int rows, int cols, int scrollbars);
```

TextListener의 textValueChanged를 사용할 수 있다. textValueChanged는 TextArea의 텍스트가 변경될 때 호출된다.

## 2.6 TextField

한 줄의 텍스트를 입력할 수 있는 컴포넌트이다. 다음과 같은 생성자를 가진다.

```java
new TextField();
new TextField(int cols);
new TextField(String text);
new TextField(String text, int cols);
```

TextListener의 textValueChanged를 사용할 수 있다. textValueChanged는 TextField의 텍스트가 변경될 때 호출된다.

또한 키 입력을 받기 위해 KeyListener가 아니라 이를 구현한 클래스인 KeyAdapter를 사용할 수 있다.

## 2.7 List

List는 여러 개의 항목을 선택할 수 있는 컴포넌트이다. 여러 개의 요소들을 스크롤하면서 하나 혹은 여러 요소를 선택할 수 있다.

```java
new List();
new List(int rows);
// multiple는 여러 개의 요소를 선택할 수 있는지를 결정한다.
new List(int rows, boolean multiple);
```

다음과 같이 사용한다.

```java
public class Main {
    private Frame f;
    private List l;
    public Main(){
        f=new Frame("List Sample");
        l=new List(4, true);
        l.add("A");
        l.add("B");
        l.add("C");
        l.add("D");
        f.add(l, BorderLayout.CENTER);
        f.pack();
        f.addWindowListener(new WindowDestroyer());
        f.setVisible(true);
    }

    public static void main(String args[]){
        Main M=new Main();
    }
}
```

## 2.8 Dialog

Dialog는 다른 컴포넌트 위에 떠있는 컴포넌트이다. Dialog는 Frame의 메소드를 사용하여 생성할 수 있다.

또한 다이얼로그가 소속된 프레임이나 다른 다이얼로그의 상태에 따라 사용자에게 보이는지 여부가 변한다. 다이얼로그가 속한 프레임이 닫힌 상태라면 다이얼로그도 보이지 않게 된다.

WindowListener의 windowOpened, windowClosing, windowClosed, windowActivated, windowDeactivated등의 이벤트 메서드를 사용할 수 있다.

생성자는 다음과 같다.

```java
new Dialog(Dialog owner);
new Dialog(Dialog owner, String title);
new Dialog(Dialog owner, String title, boolean modal);
new Dialog(Frame owner);
new Dialog(Frame owner, boolean modal);
new Dialog(Frame owner, String title);
new Dialog(Frame owner, String title, boolean modal);
```

또한 dispose 메서드를 사용하여 다이얼로그를 닫을 수 있고 ActionListener의 actionPerformed를 사용하여 다이얼로그의 버튼을 눌렀을 때의 이벤트를 처리할 수 있다.

## 2.9 FileDialog

FileDialog는 파일을 선택할 수 있는 다이얼로그이다. 생성자는 다음과 같다.

```java
new FileDialog(Frame owner);
new FileDialog(Frame owner, String title);
new FileDialog(Frame owner, String title, int mode);
```

모드는 다음과 같다. FileDialog.LOAD는 파일을 불러오는 모드이고 FileDialog.SAVE는 파일을 저장하는 모드이다.

## 2.10 Menu

메뉴바 -> 메뉴 -> 메뉴아이템.

메뉴바는 Frame의 setMenuBar를 사용하여 추가할 수 있다.

```java
MenuBar mb=new MenuBar();
Menu fileMenu=new Menu("File");
fileMenu.add(new MenuItem("Open"));
fileMenu.add(new MenuItem("Save"));
fileMenu.addSeparator(); //구분자 넣기
fileMenu.add(new MenuItem("Exit"));
mb.add(fileMenu);
f.setMenuBar(mb);
```

또 CheckboxMenuItem을 사용하여 체크박스도 메뉴에 넣을 수 있다.
