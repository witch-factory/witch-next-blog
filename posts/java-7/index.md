---
title: 중간고사 대비 java 7단원 정리
date: "2022-10-19T00:00:00Z"
description: "중간고사 대비 JAVA 내용 정리 7단원"
tags: ["language"]
---

혼자 공부하는 자바 7단원 상속 내용 정리

# 1. 상속

상속은 이미 만들어진 클래스를 재사용하여 새로운 클래스를 작성하는 것을 말한다. 자식 클래스를 선언할 때 extends 키워드로 어떤 부모 클래스를 상속할지 정의할 수 있다. 예를 들어서 다음과 같이 Person 클래스를 상속받은 Student 클래스를 만들 수 있다.

```java
class Student extends Person {
    // ...
}
```

상속에서 주의해야 할 특징은 다음과 같다.

- 여러 개의 부모 클래스를 상속할 수 없다.
- 부모 클래스에서 private 접근 제한을 갖는 필드, 메소드는 상속 대상에서 제외된다. 부모와 자식이 다른 패키지에 있다면 default 접근 제한을 갖는 필드, 메소드도 상속 대상에서 제외된다.

## 1.1 부모 생성자 호출

A클래스를 상속하여 B클래스를 만들었다고 하자. 그러면 B클래스의 생성자는 A클래스의 생성자를 호출하게 된다. 부모 객체가 없이는 자식 객체도 만들어질 수 없다.

이때 super 키워드를 사용한다. super 키워드는 부모 클래스의 생성자를 호출하는데 사용한다. super 키워드는 생성자의 첫 번째 문장에서만 사용할 수 있다. super 키워드를 사용하지 않으면 컴파일러가 자동으로 super()를 추가한다.

super()는 부모 클래스의 기본 생성자를 호출한다. 이때 부모 클래스에 기본 생성자가 없다면 컴파일 에러가 발생한다.

즉 자식 클래스의 생성자에서는 암묵적이든 명시적이든 부모 클래스 생성자를 호출해야 한다.

```java
class Parent{
  String name;

  // Parent 클래스는 기본 생성자가 없기 때문에 자식 클래스에서 super()를 호출하면 오류가 발생한다.
  Parent(String name){
    this.name=name;
  }
}

class Child extends Parent{
  Child(){
    super("김성현");
  }
}
```

## 1.2 메소드 오버라이딩

부모 클래스에서 정의한 메소드를 자식 클래스에서 재정의하는 것을 메소드 오버라이딩이라고 한다. 상속된 일부 메소드를 자식 클래스에서 수정해서 사용하는 것이다.

메소드 오버라이딩을 할 때는 다음과 같은 주의사항이 있다.

- 부모 클래스의 메소드와 동일한 시그니처를 가져야 한다. 즉 메소드 이름, 매개변수, 리턴 타입이 같아야 한다.
- 접근 제한을 더 강하게 할 수 없다(ex : 부모의 메소드는 public인데 자식이 오버라이딩한 메소드가 private인 등)
- 새로운 예외를 throw할 수 없다.

메소드가 재정의되면 자식 객체에서 그 메소드를 호출시 부모 클래스의 메소드가 아니라 자식 클래스에서 재정의한 메소드가 호출된다.

함수 오버라이딩 시 선언 위에 `@Override` 어노테이션을 붙이면 컴파일러가 오버라이딩이 제대로 되었는지 확인해준다.

그런데 만약 부모 클래스의 메소드를 자식 클래스에서 오버라이딩하지 않고 그대로 사용하고 싶다면 `super` 키워드를 사용하면 된다.

```java
super.메소드이름(매개변수); // 부모 클래스의 메소드를 호출하게 된다.
```

## 1.3 final 클래스

final 키워드는 클래스를 정의할 때도 `public final class className`과 같이 붙여서 사용할 수 있다. final 클래스는 상속할 수 없는 클래스이다. 예를 들어서 String 클래스가 바로 final 클래스이다.

```java
// String이 final 클래스이기 때문에 상속할 수 없다는 에러가 발생한다.
class MyString extends String{}
```

메소드를 선언할 때 final 키워드를 붙이면 이 메소드가 최종적인 메소드라는 뜻이 된다. 즉 final 메소드는 자식 클래스에서 오버라이딩할 수 없다.

## 1.4 protected 접근 제한자

protected 접근 제한자는 클래스 내부, 같은 패키지, 그리고 다른 패키지의 자식 클래스에서 접근할 수 있다. 즉 클래스 내부에선 자유롭게 접근 가능하고, 같은 패키지 내에서도 자유롭게 접근 가능하다. 그리고 다른 패키지에 속해 있을 경우 자식 클래스에서만 접근이 가능하다.

# 2. 타입 변환과 다형성

다형성은 객체 지향에서 나오는 개념으로 사용 방법은 동일하지만 다양한 객체를 이용해 다양한 결과가 나오도록 하는 것이다. 이를 구현하기 위해선 메소드 오버라이딩과 타입 변환이 필요하다.

## 2.1 클래스의 타입 변환

클래스에서도 타입 변환이 있다. 클래스의 타입 변환은 상속 관계에 있는 클래스 사이에서 나타나는데 자식 클래스는 부모 타입으로 자동 타입 변환이 가능하다. 부모타입 변수에 자식 타입 객체를 대입할 때 발생한다.

Cat 클래스가 Animal 클래스를 상속한다면 `Animal a=new Cat()` 과 같은 코드에서 Cat 객체는 Animal 타입으로 변환되어 대입된다.

또한 바로 위의 부모 클래스가 아니더라도 상속 계층에서 상위 타입이면 자동 타입 변환이 일어날 수 있다.

이때 주의할 점은 부모 타입으로 자동 타입변환된 뒤에는 부모 클래스에 선언된 멤버만 사용할 수 있다는 것이다. 자식 클래스에 선언된 멤버는 사용할 수 없다. 하지만 자식 클래스에서 오버라이딩한 메소드는 부모 클래스 타입으로 자동 타입 변환된 뒤에도 사용할 수 있으며 호출시 자식 클래스의 메소드가 호출된다. 재정의된 자식 클래스 메소드가 호출되는 건 다형성과 관련이 있다.

```java
package study;

class Animal{
  public void eat(){
      System.out.println("Animal is eating");
  }
}

class Cat extends Animal{
  public void eat(){
      System.out.println("Cat is eating");
  }

  public void meow(){
      System.out.println("Cat is meowing");
  }
}

public class Hello {
  public static void main(String[] args){
    Cat c=new Cat();
    Animal a = c; // c는 Animal 타입으로 형변환됨
    a.eat(); // 자식 클래스에서 eat() 메소드가 오버라이딩 되었으므로 Cat 클래스의 eat() 메소드가 호출됨
    c.eat(); // 당연히 Cat 클래스의 eat() 메소드가 호출됨
    c.meow(); // Cat 클래스의 meow() 메소드가 호출됨. Animal 클래스에는 meow() 메소드가 없으므로 a.meow()로는 호출 불가
  }
}
```

이런 자동 타입 변환을 구현한 이유는 다형성을 위해서이다. 필드 타입을 부모 클래스 타입으로 선언시 다양한 자식 클래스 인스턴스들이 그 변수에 저장될 것이다. 그러면 그 필드에서 같은 메소드를 호출해도 어떤 자식 클래스 인스턴스가 대입되어 있느냐에 따라 다양한 결과를 낼 수 있다.

## 2.2 매개 변수 다형성

자동 타입 변환은 필드 값 대입시에도 발생하지만 주로 메소드 호출 시 많이 발생한다. 메소드의 매개변수 타입이 A클래스라면, 메소드의 매개 변수로 A클래스를 상속한 B클래스 인스턴스를 넘겨주는 등이다. 그러면 B클래스 인스턴스는 자동으로 A클래스 타입으로 변환되어 메소드의 매개 변수로 전달된다. 해당 클래스 객체뿐 아니라 자식 객체까지도 매개값으로 사용할 수 있는 것이다. 이런 자동 타입 변환을 매개 변수 다형성이라고 한다.

다음 코드를 보면 같은 driver 객체에서 drive 메소드를 호출했지만 다른 결과가 나오는 것을 볼 수 있다.

```java
package study;

class Vehicle{
  public void run(){
    System.out.println("Vehicle is running");
  }
}

class Driver{
  public void drive(Vehicle v){
    v.run();
  }
}

class Bus extends Vehicle{
  @Override
  public void run(){
    System.out.println("Bus is running");
  }
}

class Taxi extends Vehicle{
  @Override
  public void run(){
    System.out.println("Taxi is running");
  }
}


public class Hello {
  public static void main(String[] args){
    Driver d = new Driver();
    Bus b = new Bus();
    Taxi t = new Taxi();
    d.drive(b); // Bus is running
    d.drive(t); // Taxi is running
  }
}
```

강제 타입 변환도 할 수 있다. 부모 타입을 자식 타입으로 변환하는 것이다. 하지만 모든 부모 타입 인스턴스를 자식 타입으로 변환할 수 있는 건 아니다. 자식 타입 인스턴스가 부모 타입으로 자동 타입 변환된 후 그 인스턴스를 사용할 때 강제 타입 변환을 사용할 수 있다.

만약 모든 부모 타입 인스턴스를 자식 타입으로 변환할 수 있다면 자식 타입 인스턴스에만 있는 메소드를 사용할 수 없는 문제가 생기기 때문이다.

```java
Parent p=new Child();
Child c=(Child)p;
```

자식 타입이 부모 타입으로 자동 타입변환되었을 때는 부모 타입의 필드와 메소드만 사용 가능하다. 이때 자식에 선언된 필드, 메소드를 꼭 사용해야 할 때 다시 자식 타입으로 강제 타입 변환을 하는 것이다.

강제 타입 변환은 자식 타입이 부모 타입으로 변환되어 있는 상태에서만 가능하다. 그래서 주의할 점은 강제 타입 변환을 하기 전에 반드시 instanceof 연산자로 자식 타입으로 변환할 수 있는지 확인해야 한다. 다음과 같이 확인하는 것이다. 그렇게 하지 않으면 ClassCastException이 발생한다.

```java
if(p instanceof Child){
  Child c=(Child)p;
}
```

# 3. 추상 클래스

객체를 직접 생성할 수 있는 클래스를 실체 클래스라 한다면 그 공통 특성을 추출해 선언한 걸 추상 클래스라 한다. 추상 클래스를 상속하여 실체 클래스를 만드는 것이다. 예를 들어서 Bird, Tiger, Fish 클래스의 공통된 필드, 메소드를 따로 선언한 Animal 클래스를 먼저 만들고 Bird, Tiger, Fish 클래스가 Animal 클래스를 상속받는 것이다.

이런 추상 클래스를 선언하는 이유는 다음과 같다.

- 공통된 필드와 메소드 이름을 통일하여 일관성을 유지할 수 있다.
- 실체 클래스를 작성할 때 시간을 절약할 수 있다.

추상 클래스를 선언할 때는 클래스 선언에 `abstract`를 붙여야 한다. 이 키워드가 붙은 클래스는 new를 이용해서 객체를 만들지 못하고 상속을 통해 자식 클래스만 만들 수 있다.

단 추상 클래스도 필드, 메소드, 생성자 선언을 할 수 있다. 생성자가 있으므로 자식 클래스 생성자에서도 super(매개변수)를 이용해서 부모 클래스의 생성자를 호출해야 한다.

추상 클래스는 실체 클래스가 공통적으로 가져야 할 필드와 메소드를 정의해 놓은 추상 클래스다. 따라서 모든 자식 클래스가 가진 메소드의 내용이 같다면 추상 클래스에 메소드를 작성하는 게 좋다.

하지만 메소드 선언만 공통이고 내용은 자식마다 달라야 할 수 있다. 그러면 추상 클래스에 추상 메소드를 선언할 수 있다. 추상 메소드는 메소드 선언부만 있고 메소드 내용이 없는 메소드다. 추상 메소드를 선언하면 자식 클래스에서 반드시 메소드 내용을 작성해야 한다. 자식 클래스에서 추상 메소드 재정의를 하지 않을 시 컴파일 에러가 발생한다.

```java
[접근 제한자] abstract [리턴타입] [메소드명](매개변수)
```