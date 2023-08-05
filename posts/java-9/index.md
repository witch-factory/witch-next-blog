---
title: 혼자 공부하는 자바 9단원 정리
date: "2022-11-11T01:00:00Z"
description: "중첩 클래스와 중첩 인터페이스"
tags: ["java"]
---

자바 중간고사가 끝났다. 그 뒤에는 응용 프로그래밍을 배우고 있다. 하지만 '혼자 공부하는 자바' 책 내용이 아직 남았기 때문에 그것을 정리하고 있다. 이번에는 9단원 중첩 클래스와 중첩 인터페이스에 대해 정리한다.

객체 지향 프로그래밍에서 클래스들은 서로 상호작용한다. 이때 어떤 클래스는 특정 클래스와만 관계를 맺게 되는데 이 경우 클래스 내부에 클래스를 선언할 수 있다.

# 1. 중첩 클래스

중첩 클래스는 말 그대로 클래스 내부에 선언한 클래스이다. 이러면 외부에는 불필요한 관계 클래스를 감출 수 있다.

```java
class Outer {
    class Inner {
        //내부 클래스
    }
}
```

이때 클래스의 멤버로 선언되는 중첩 클래스는 멤버 클래스, 생성자나 메소드 내부에서 선언되는 중첩 클래스를 로컬 클래스라 한다. 로컬 클래스는 메소드 실행시에만 사용되고 메소드 종료시 사라진다.

//static 접근에 관한 내용 todo

중첩 클래스도 컴파일시 바이트코드 파일 .class파일이 생성된다.

## 1.1 인스턴스 멤버 클래스

인스턴스 멤버 클래스는 static 키워드 없이 중첩 선언된 클래스이다. 이 클래스에는 정적 필드와 메소드는 선언할 수 없다.

```java
class A{
  // B 클래스가 인스턴스 멤버 클래스
  class B{
    B(){
      System.out.println("B");
    }
    int a;
    void print(){
      System.out.println("in classB");
    }
    static int c; //에러. 정적 필드는 인스턴스 멤버 클래스에 선언 불가능
  }
}
```

A 클래스 외부에서 B 클래스를 사용하려면 A 클래스의 인스턴스를 생성해야 한다.

```java
A a=new A();
A.B b=a.new B();
```

A 클래스 내부에서는 A 객체 없이 B 객체를 생성할 수 있다. 단 B클래스는 A 클래스 내부의 클래스이므로 A 클래스 내부에서만 사용하는 게 일반적이다.

만약 인스턴스 멤버 클래스에 static 필드를 선언하려고 시도할 시 'The field [변수명] cannot be declared static in a non-static inner type, unless initialized with a constant expression' 이라는 오류가 뜬다.

인스턴스 멤버 클래스에 정적 멤버가 선언 불가능한 이유는 있을 이유가 없고 모호해질 수 있는 가능성이 있기 때문이다.

먼저 클래스에 정적 멤버가 있는 이유는 인스턴스 생성 없이 클래스 자체에 속한 어떤 데이터를 정의하기 위함인데 인스턴스 멤버 클래스는 애초에 상위 인스턴스가 있기 때문에 멤버 클래스 자체에 속한 데이터를 정의할 이유가 없다.

또한 정적 멤버는 클래스 자체에 귀속되어서 모든 클래스 인스턴스에 대해서 공유되지만 인스턴스 멤버 클래스는 상위 인스턴스에 귀속되기 때문에 정적 멤버가 있으면 모호해질 수 있다.

```java
class A{
  class B{
    static int BMember;
  }
}
```

인스턴스 멤버 클래스에 정적 멤버가 있을 수 있다고 가정하고 위와 같은 코드가 있다고 하자. 그리고 A 클래스의 인스턴스 2개를 만들고 BMember의 값을 각각 바꾸었다.

```java
A a1=new A();
A a2=new A();
a1.B.BMember=1;
a2.B.BMember=2;
```

이렇게 하면 BMember의 값은 무엇이 되어야 하는가? 같은 B 클래스이므로 나중에 대입한 2가 되어야 하는가 아니면 a1의 B와 a2의 B는 서로 다른 클래스이므로 1과 2가 되어야 하는가?

같은 B클래스라고 가정하면 a1과 a2는 다른 인스턴스인데 같은 인스턴스 멤버 클래스를 갖기 때문에 이상하고 a1,a2의 B가 다른 B클래스라고 가정하면 BMember는 정적 멤버인데 a1.B.BMember와 a2.B.BMember가 다른 값을 갖는지가 이상하다.

이런 모호함이 생길 수 있기 때문에 인스턴스 멤버 클래스에 정적 멤버를 선언할 수 없다.

## 1.2 정적 멤버 클래스

정적 멤버 클래스는 static 키워드가 붙어서 선언된 클래스이다. 이 클래스에는 모든 종류의 필드와 모든 종류 메소드를 선언할 수 있다.

```java
class A{
  A(){
    System.out.println("A");
  }
  static class C{
    C(){
      System.out.println("C");
    }
    int a;
    static int b;
    void print(){
      System.out.println("in classC");
    }
  }
}
```

정적 멤버 클래스의 객체 생성은 상위 클래스의 객체 생성 없이도 가능하다.

```java
A.C c = new A.C();
c.print();
```

## 1.3 로컬 클래스

로컬 클래스는 메소드 내부에 선언된 클래스이다. 로컬 클래스는 메소드 내부에서만 사용할 수 있으며 메소드가 종료되면 메모리에서 사라진다. 따라서 접근 제한자나 static을 붙일 수 없다. 어차피 메소드 내에서만 사용되기 때문이다. 같은 이유로 인스턴스 필드와 메소드만 선언할 수 있고 정적 멤버는 선언할 수 없다.

```java
class A{
  // B 클래스가 인스턴스 멤버 클래스
  A(){
    System.out.println("A");
  }

  void method(){
    // 로컬 클래스
    class D{
      D(){
        System.out.println("D");
      }
      int a;
      void print(){
        System.out.println("in classD");
      }
    }
    D d = new D();
    d.print();
  }
}
```

로컬 클래스는 상위 클래스의 메소드 내에서 사용된다. 특정 메소드를 선언하면 그 클래스가 사용되는 것이다.

```java
A a = new A();
// method 내부에서 D 클래스 사용
a.method();
```

## 1.4 중첩 클래스 접근 제한

### 1.4.1 바깥 클래스에서 멤버 클래스 접근

바깥 클래스에서 멤버 클래스를 사용할 때는 몇 가지 제한이 있다. 상식적으로 생각해 보면 당연한 제한이 대부분이다.

- 인스턴스 멤버 클래스 객체는 바깥 클래스의 인스턴스 필드와 메소드에서만 생성할 수 있다.
- 정적 멤버 클래스 객체는 바깥 클래스의 모든 필드와 메소드에서 생성할 수 있다.

인스턴스 멤버 클래스는 말 그대로 바깥 클래스의 인스턴스에 소속된 것이므로 인스턴스가 있어야만 쓸 수 있다. 따라서 바깥 클래스의 인스턴스 필드와 메소드에서만 생성할 수 있는 것이 당연하다.

반면 정적 멤버 클래스는 바깥 클래스 그 자체에 속한 것이므로 바깥 클래스의 모든 곳에서 인스턴스를 생성할 수 있다.

### 1.4.2 멤버 클래스에서 바깥 클래스 접근

- 인스턴스 멤버 클래스에선 바깥 클래스의 모든 필드와 메소드에 접근할 수 있다.
- 정적 멤버 클래스에서는 바깥 클래스의 정적 필드, 정적 메소드에만 접근할 수 있다.

인스턴스 멤버 클래스는 각 인스턴스별로 있으므로 클래스 자체에 소속된 정적 멤버에는 당연히 접근할 수 있다.

반면 정적 멤버 클래스는 바깥 클래스의 인스턴스와는 관계가 없으므로 바깥 클래스의 인스턴스 필드와 메소드에는 접근할 수 없다.

```java
class A{
  // B 클래스가 인스턴스 멤버 클래스
  int field1;
  static int field2;
  void method1(){
    System.out.println("A instance method1()");
  }
  static void method2(){
    System.out.println("A static method2()");
  }

  class B{
    void method(){
      field1 = 10;
      field2 = 10;
      method1();
      method2();
    }
  }

  static class C{
    void method(){
      // 정적 멤버에만 접근 가능
      // field1 = 10;
      field2 = 10;
      // method1();
      method2();
    }
  }
}
```

### 1.4.3 로컬 클래스에서 바깥 클래스 멤버 접근

메소드의 매개변수 혹은 로컬 변수를 로컬 클래스에서 사용할 때가 있을 수 있다. 로컬 클래스는 메소드 내에서만 존재하므로 메소드가 종료될 시 로컬 클래스도 사라지는 게 일반적이다. 그러나 스레드의 경우 메소드가 종료되어도 로컬 스레드 객체가 실행 상태로 존재할 수 있다.

이런 부분을 막기 위해 자바는 컴파일 시 로컬 클래스에서 사용하는 매개변수와 로컬 변수를 final로 선언한다. 즉 로컬 클래스 내에서 매개 변수나 로컬 변수를 변경할 수 없다. 만약 final로 선언되어 있지 않더라도 자동으로 final로 선언된다.

만약 이를 어기고 로컬 클래스 내에서 매개 변수나 로컬 변수를 변경하려고 하면 컴파일 에러가 발생한다. 'Local variable [변수명] defined in an enclosing scope must be final or effectively final' 이라는 에러로, 해당 변수는 final이거나 final과 같은 효과를 가져야 한다는 뜻이다. 즉 로컬 클래스 내에서 매개 변수나 로컬 변수를 변경하지 말라는 뜻이다.

### 1.4.4 중첩 클래스에서 바깥 클래스 참조하기

클래스 내부에서 `this`는 객체 스스로를 참조한다. 하지만 중첩 클래스에서 바깥 클래스의 참조가 필요할 때가 있다. 바깥 클래스의 메소드를 사용하는 등이다. 그럴 때는 바깥 클래스의 이름을 this 앞에 붙여 주면 된다.

```java
class A{
  String field="Outter field";
  void method(){
    System.out.println("Outter class");
  }

  class B{
    String field="Inner field";
    void method(){
      System.out.println("Inner class");
    }
    void print (){
      System.out.println(this.field);
      this.method();
      System.out.println(A.this.field);
      A.this.method();
    }
  }
}
```

그리고 다음과 같은 코드를 메인 함수에서 실행해 본다.

```java
A a = new A();
A.B b = a.new B();
b.print();
```

결과는 다음과 같다.

```
Inner field
Inner class
Outter field
Outter class
```

# 2. 중첩 인터페이스

중첩 인터페이스는 클래스 멤버로 선언된 인터페이스이다. 인스턴스 멤버 인터페이스와 정적 멤버 인터페이스 모두 가능하다. 접근 같은 경우 중첩 클래스와 동일하다.

주로 UI 프로그래밍에서 이벤트 처리 목적으로 많이 쓰인다.

# 3. 익명 객체

익명 객체는 이름이 없는 객체이다. 익명 객체는 어떤 클래스를 상속하거나 인터페이스를 구현해야 한다. 일반적인 경우 명시적으로 클래스 이름을 주고 선언한다. 하지만 익명 객체는 부모 클래스나 인터페이스를 상속하거나 구현하는 익명 클래스를 선언하고, 그 클래스의 인스턴스를 생성하는 것을 동시에 한다. 따라서 익명 객체는 클래스 이름이 없으며 부모 클래스나 인터페이스를 구현해야 한다.

## 3.1 익명 자식 객체

일반적으로 특정 클래스의 자식 객체를 생성할 땐 다음과 같이 한다. 먼저 부모 클래스와 그것을 상속한 자식 클래스를 선언한다.

```java
class Parent{
  Parent(){
    System.out.println("Parent Constructor");
  }
}

class Child extends Parent{
  Child(){
    System.out.println("Child Constructor");
  }
}
```

그리고 다음과 같이 자식 객체를 생성한다.

```java
Parent a=new Child();
```

하지만 자식 클래스가 재사용되지 않고 특정 위치에서 한 번만 사용되는 경우에는 간단히 익명 객체를 사용할 수 있다. 다음과 같이 익명 객체를 생성한다.

```java
class Parent{
  Parent(){
    System.out.println("Parent Constructor");
  }

  void method(){
    System.out.println("Parent method");
  }
}

// 익명 객체를 선언해 사용하는 부분
Parent a=new Parent(){
  @Override
  void method(){
    System.out.println("Child method");
  }
};
a.method();
```

보통 익명 객체 내에서는 부모 클래스의 메소드를 재정의한다. 그리고 익명 객체 내에서는 생성자를 선언할 수 없다. 익명 객체 생성시 넣은 인자가 부모 클래스 생성자에 넣어져서 부모 클래스 생성자가 호출될 뿐이다.

이런 익명 객체는 로컬 변수를 선언할 때의 초기값, 메소드의 인자로 넘겨줄 때, 메소드의 리턴값으로 사용할 때 등 웬만한 곳에 모두 사용할 수 있다.

이때 주의할 점은 익명 객체는 부모 클래스 타입 변수에 대입되기 때문에 익명 객체에 새롭게 정의된 필드, 메소드는 익명 객체 외부에서 접근할 수 없다. 원래라면 부모 클래스 타입 변수를 자식 클래스 타입으로 형변환하는 방식으로 사용할 수도 있겠지만 익명 객체는 이름이 없기 때문에 자식 클래스 타입 변환도 불가능하다.

```java
Parent a=new Parent(){
  @Override
  void method(){
    System.out.println("Child method");
  }
  // 부모 클래스에 없는 메소드
  void method2(){
    System.out.println("Child method, second");
  }
};
a.method();
a.method2(); //에러. 익명 객체에 새로 정의된 메소드를 외부에서 호출할 수 없다.
```

## 3.2 익명 구현 객체

인터페이스 타입의 구현 객체를 생성할 때는 일반적으로 인터페이스 선언 -> 인터페이스의 구현 클래스 선언 -> 구현 객체 생성의 과정을 거친다. 하지만 이 과정을 생략하고 인터페이스를 구현한 익명 구현 객체를 생성할 수도 있다.

예시로 Person 인터페이스를 선언하고 그 익명 구현 객체를 만들어 보았다. 이때 익명 구현 객체는 인터페이스에 선언된 모든 추상 메소드를 구현해야 한다.

```java
interface Person{
  public void setName(String name);
  public String getName();
}

// 익명 구현 객체 선언과 사용
Person me=new Person(){
  String name;
  @Override
  public void setName(String name){
    this.name=name;
  }
  @Override
  public String getName(){
    return name;
  }
};
me.setName("witch");
System.out.println(me.getName());
```

이런 방식으로 익명 객체를 필드 선언, 로컬 변수 선언, 메소드의 인자로 넘겨주기, 메소드의 리턴값으로 사용할 수 있다. 익명 구현 객체도 메소드 인자로 들어갈 수 있다!

## 3.3 익명 객체에서 로컬 변수 사용

익명 객체는 메소드 실행이 종료되면 보통 없어진다. 하지만 익명 스레드 객체를 사용할 때는 익명 객체가 메소드 실행이 종료되어도 계속 살아있다.

이때 메소드의 매개 변수나 로컬 변수를 이러한 익명 객체 내에서 사용하면 문제가 발생한다. 매개변수, 로컬 변수는 메소드 실행이 끝나면 메모리에서 사라지기 때문에 메소드가 끝나도 익명 객체가 살아있는 경우 이 변수들을 사용할 수 없어진다.

자바는 따라서 컴파일시 익명 객체에서 쓰는 매개 변수, 로컬 변수를 익명 객체에 복사해두고 사용한다. 그리고 매개 변수, 로컬 변수가 수정되면 익명객체의 값과 일관성이 사라지므로 매개변수, 로컬 변수를 final로 선언하도록 강제한다. 만약 그렇게 하지 않으면 java8부터는 final을 자동으로 붙여 준다.

다음과 같은 코드는 매개변수나 로컬 변수를 변경하지 않으므로 정상적으로 작동한다.

```java
//인터페이스
interface Calculate{
  public int sum_args();
  public int sum_locals();
}
```

```java
class Anonymous{
  public void method(int arg1, int arg2){
    int b1=3;
    int b2=4;

    // 익명 구현 객체 사용
    Calculate calc=new Calculate() {
      @Override
      public int sum_args() {
        return arg1+arg2;
      }
      @Override
      public int sum_locals() {
        return b1+b2;
      }
    };
    // 매개변수 합
    System.out.println(calc.sum_args());
    // 로컬 변수 합
    System.out.println(calc.sum_locals());
  }
}
```

하지만 익명 객체에서 사용하는 로컬 변수를 변경하면 컴파일 에러가 발생한다.

```java
class Anonymous{
  public void method(int arg1, int arg2){
    int b1=3;
    int b2=4;

    /* 익명 객체에서 사용하는 매개변수 혹은 로컬 변수를 변경하는 시도는 모두 에러 발생
    자동으로 final로 취급되는 것들이기 때문
    arg1=10;
    arg2=20;

    b1=30;
    b2=40;
    */

    Calculate calc=new Calculate() {
      @Override
      public int sum_args() {
        return arg1+arg2;
      }
      @Override
      public int sum_locals() {
        return b1+b2;
      }
    };
    // 매개변수 합
    System.out.println(calc.sum_args());
    // 로컬 변수 합
    System.out.println(calc.sum_locals());
  }
}
```

# 참고

인스턴스 멤버 클래스에 정적 멤버 변수가 있을 수 없는 이유 https://stackoverflow.com/questions/1953530/why-does-java-prohibit-static-fields-in-inner-classes
