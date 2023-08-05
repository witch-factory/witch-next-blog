---
title: 프론트 지식 익히기 Javascript - 2
date: "2023-05-10T00:00:00Z"
description: "MDN Javascript 튜토리얼 - 2"
tags: ["web", "study", "front", "js"]
---

# 1. JSON

JSON==Javascript Object Notation은 JS 객체 문법으로 구조화된 데이터를 표현하는 표준 포맷이다. 웹에서 데이터 전송시 많이 사용한다. 

실제 JS 객체와의 차이는 먼저 프로퍼티만 담을 수 있고 메서드는 담을 수 없다는 점이다(배열은 가능). 또 문자열 혹은 프로퍼티 이름 작성시 큰따옴표만 써야 한다. 또한 모든 프로퍼티가 큰따옴표로 싸인 문자열이다.

`JSON.parse`는 JSON 문자열을 매개변수로 받아 JS 객체로 변환한다. 반대로 `JSON.stringify`는 JS 객체를 매개변수로 받아 JSON 문자열로 변환한다.

# 2. 객체 만들기 연습

MDN에 있는 실제로 JS 객체를 만드는 코드를 짜보자. Canvas API를 사용한다.

먼저 다음과 같은 HTML을 만든다.

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>공튀기기</title>
    <link rel="stylesheet" href="index.css">
  </head>

  <body>
    <h1>공튀기기</h1>
    <canvas></canvas>

    <script src="main.js"></script>
  </body>
</html>
```

그리고 [여기](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice#getting_started)에 있는 css, js 파일을 복사하자. 스크롤바를 숨기고 캔버스를 화면에 꽉 차게 만들며 기본적인 함수 선언이 된 코드다.

그리고 JS 파일에 다음처럼 공 클래스를 작성한다.

```js
class Ball{
  /*
  x, y는 공의 2차원 좌표, velX, velY는 공의 2차원 속도
  color,size는 공의 색상과 크기(px단위 반지름)
  */
  constructor(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size
  }

  // 공을 canvas 객체(ctx)에 그린다.
  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.fill();
  }
}
```

이제 Ball 클래스 생성자를 통해 공을 만들고 `ball.draw()`를 호출하면 공을 그릴 수 있다. 그리고 공의 위치를 업데이트하는 함수를 클래스 내에 작성한다.

```js
update(){
  // 공이 반대 방향으로 튀기는 것
  if(this.x+this.size>=width){
    this.velX = -(this.velX);
  }

  if(this.x-this.size<=0){
    this.velX = -(this.velX);
  }

  if(this.y+this.size>=height){
    this.velY = -(this.velY);
  }

  if(this.y-this.size<=0){
    this.velY = -(this.velY);
  }
  //공 위치 업데이트
  this.x+=this.velX;
  this.y+=this.velY;
}
```

이제 공들을 캔버스에 만들어 보자. 다음 코드는 랜덤하게 위치와 속도, 크기를 지정한 공을 만들고 캔버스에 그리는 코드다.

```js
const balls=[];

while(balls.length<25){
  let size = random(10,20);
  let ball = new Ball(
    random(0+size,width-size),
    random(0+size,height-size),
    random(-7,7),
    random(-7,7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i=0;i<balls.length;i++){
    balls[i].draw();
    balls[i].update();
  }
  // loop를 재귀적으로 호출
  requestAnimationFrame(loop);
}

loop();
```

이를 브라우저에서 열어보면 검은 배경에 공들이 움직이는 걸 볼 수 있다. 이제 충돌도 구현해보자. 다음 메서드를 Ball 생성자에 추가한다.

```js
collisionDetect(){
  for(const ball of balls){
    if(this!==ball){
      const dx = this.x-ball.x;
      const dy = this.y-ball.y;
      const distance = Math.sqrt(dx*dx+dy*dy);
      // 물리적인 충돌 시뮬레이션이 목적은 아니므로, 충돌시 색만 같게 한다.
      if(distance<this.size+ball.size){
        ball.color = this.color = randomRGB();
      }
    }
  }
}
```

그리고 loop 함수의 모든 공을 순회하는 부분에 공 각각의 collisionDetect 메서드를 호출하도록 추가한다.

```js
function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i=0;i<balls.length;i++){
    balls[i].draw();
    balls[i].update();
    // 이 부분 추가
    balls[i].collisionDetect();
  }
  // loop를 재귀적으로 호출
  requestAnimationFrame(loop);
}
```

## 2.1. 예제 발전시키기

사용자가 조작할 수 있는 공을 추가하고 거기에 공이 닿으면 공이 사라지도록 해보자. 또한 클래스 설계를 좀더 잘해보자.

먼저 사용자가 조작할 수 있는 공과 그냥 공이 상속받을 일반적인 `Shape`클래스를 정의하자. `Shape`클래스는 `Ball`클래스와 `EvilCircle`클래스의 공통점인 위치와 속도만을 담는다.

```js
class Shape{
  constructor(x,y,velX,velY){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}
```

그리고 `Ball` 클래스가 Shape를 상속받는 걸로 하고 생성자를 바꾸자. canvas에 공이 존재하는지를 뜻하는 exists 프로퍼티도 추가하고 충돌 감지 함수도 exist 시에만 체크하도록 변경한다.

```js
class Ball extends Shape{
  constructor(x, y, velX, velY, color, size){
    super(x,y,velX,velY);
    this.color = color;
    this.size = size
    // 공이 존재하는지(사용자 공에게 먹히면 false가 됨)
    this.exists = true;
  }
  // ...

  collisionDetect(){
    for(const ball of balls){
      if(this!==ball && ball.exists){
        const dx = this.x-ball.x;
        const dy = this.y-ball.y;
        const distance = Math.sqrt(dx*dx+dy*dy);
        // 물리적인 충돌 시뮬레이션이 목적은 아니므로, 충돌시 색만 같게 한다.
        if(distance<this.size+ball.size){
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}
```

이제 사용자가 조작할 공, 공을 먹어치우는 EvilCircle을 정의하자. EvilCircle은 Shape를 상속받고, 공을 먹어치우는 메서드를 추가한다. 이런 공은 하나밖에 없을 예정이긴 하지만 연습을 위해 클래스를 사용한다. [예제](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features)에서 시키는 그대로 하면 된다.

```js
class EvilCircle extends Shape{
  constructor(x,y){
    super(x,y,20,20);
    this.color = 'white';
    this.size = 10;
    // 사용자가 키로 조작할 수 있도록 키다운 이벤트 리스너 추가
    window.addEventListener('keydown',(e)=>{
      switch(e.key){
        case 'a':
          this.x-=this.velX;
          break;
        case 'd':
          this.x+=this.velX;
          break;
        case 'w':
          this.y-=this.velY;
          break;
        case 's':
          this.y+=this.velY;
          break;
      }
    })
  }

  // EvilCircle을 canvas 객체(ctx)에 그린다.
  draw(){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.stroke();
  }

  // 공이 화면을 벗어나지 않도록 한다.
  update(){
    // 공이 밖으로 벗어나는 걸 막는다
    if(this.x+this.size>=width){
      this.x=width-this.size;
    }

    if(this.x-this.size<=0){
      this.x=this.size;
    }

    if(this.y+this.size>=height){
      this.y=height-this.size;
    }

    if(this.y-this.size<=0){
      this.y=this.size;
    }
  }

  collisionDetect(){
    for(const ball of balls){
      // 존재하는 공만 따지면 된다.
      if(ball.exists){
        const dx = this.x-ball.x;
        const dy = this.y-ball.y;
        const distance = Math.sqrt(dx*dx+dy*dy);
        // 물리적인 충돌 시뮬레이션이 목적은 아니므로, 충돌시 색만 같게 한다.
        if(distance<this.size+ball.size){
          ball.exists = false;
        }
      }
    }
  }
}
```

그리고 evilCircle을 생성하고 loop 함수에 추가하자.

```js
const evilCircle = new EvilCircle(50,50);

function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  evilCircle.draw();
  evilCircle.update();
  evilCircle.collisionDetect();

  for(let i=0;i<balls.length;i++){
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  // loop를 재귀적으로 호출
  requestAnimationFrame(loop);
}

loop();
```

이제 공의 개수를 화면에 표시해 보자. h1 요소 아래 p태그를 배치한다. 스타일링은 예제에 있는 걸 복사하자.

```html
<h1>공튀기기</h1>
<p>Ball count :</p>
<canvas></canvas>
```

그리고 공의 개수를 loop 함수의 호출마다 세주어서 p 태그의 내용을 업데이트한다.

```js
function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  evilCircle.draw();
  evilCircle.update();
  evilCircle.collisionDetect();
  // ball 개수 업데이트
  let ballCount=0;

  for(let i=0;i<balls.length;i++){
    if(balls[i].exists){
      // 존재하는 공만 센다.
      ballCount++;
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  para.textContent = `Ball count: ${ballCount}`;
  // loop를 재귀적으로 호출
  requestAnimationFrame(loop);
}
```

이다음 브라우저에서 실행해 보면 유저가 w,a,s,d로 컨트롤할 수 있는 하얀색 원이 생기고, 공을 먹어치우면 공의 개수가 줄어드는 걸 볼 수 있다.