---
title: Practicing Object Creation with Canvas
date: "2023-08-24T00:00:00Z"
description: "MDN object practice - Creating Flying Balls"
tags: ["javascript"]
---

# Introduction

[MDN provides an example using the Canvas API for practicing JavaScript objects. This example implements flying balls and is surprisingly enjoyable.](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice)

# 1. Basic Structure

## 1.1. HTML

Create the following HTML.

```html
<!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width">
    <title>Bouncing Balls</title>
    <link rel="stylesheet" href="index.css">
  </head>

  <body>
    <h1>Bouncing Balls</h1>
    <canvas></canvas>

    <script src="main.js"></script>
  </body>
</html>
```

## 1.2. JavaScript

Next, copy the CSS and JS files from [here](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice#getting_started). This code hides the scrollbar, makes the canvas fill the screen, and includes basic function declarations.

Then, write the Ball class in the JS file as follows.

```js
class Ball{
  /*
  x, y are the 2D coordinates of the ball, velX, velY are the 2D velocities of the ball.
  color, size are the ball's color and size (radius in px).
  */
  constructor(x, y, velX, velY, color, size){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  // Draw the ball on the canvas object (ctx).
  draw(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.fill();
  }
}
```

Now, you can create a ball through the Ball class constructor and draw it by calling `ball.draw()`. Additionally, implement a function within the class to update the ball's position, enabling it to bounce off walls.

```js
update(){
  // Bounce the ball in the opposite direction.
  if(this.x + this.size >= width){
    this.velX = -(this.velX);
  }

  if(this.x - this.size <= 0){
    this.velX = -(this.velX);
  }

  if(this.y + this.size >= height){
    this.velY = -(this.velY);
  }

  if(this.y - this.size <= 0){
    this.velY = -(this.velY);
  }
  // Update ball position
  this.x += this.velX;
  this.y += this.velY;
}
```

Now, let's create balls on the canvas. The following code generates balls with random positions, speeds, and sizes, and draws them on the canvas.

```js
const balls = [];

while(balls.length < 25){
  let size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for(let i = 0; i < balls.length; i++){
    balls[i].draw();
    balls[i].update();
  }
  // Recursively call the loop
  requestAnimationFrame(loop);
}

loop();
```

When opened in a browser, you will see balls moving against a black background.

# 2. Implementing Collision Detection

Next, let's implement collision detection. Add the following method to the Ball constructor.

```js
collisionDetect(){
  for(const ball of balls){
    if(this !== ball){
      const dx = this.x - ball.x;
      const dy = this.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Since physical collision simulation is not the goal, only change the color upon collision.
      if(distance < this.size + ball.size){
        ball.color = this.color = randomRGB();
      }
    }
  }
}
```

Then, call the collisionDetect method for each ball within the loop function.

```js
function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for(let i = 0; i < balls.length; i++){
    balls[i].draw();
    balls[i].update();
    // Add this part
    balls[i].collisionDetect();
  }
  // Recursively call the loop
  requestAnimationFrame(loop);
}
```

You will see the balls change color when they collide on screen.

# 3. Enhancing the Example

## 3.1. User-Controlled Features

Let's add a user-controlled ball that disappears when it touches the balls. Additionally, let's improve the class design.

First, define a general `Shape` class that will be inherited by both the user-controlled ball and regular balls. The `Shape` class will contain only the shared properties of position and velocity for the Ball and EvilCircle classes.

```js
class Shape{
  constructor(x, y, velX, velY){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}
```

Then, modify the Ball class to inherit from Shape and adjust the constructor. Also, add an exists property that indicates whether the ball exists (becomes false if eaten by the user-controlled ball) and modify the collision detection function to check only when it exists.

```js
class Ball extends Shape{
  constructor(x, y, velX, velY, color, size){
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    // Indicates if the ball exists (set to false when eaten by the user).
    this.exists = true;
  }
  // ...

  collisionDetect(){
    for(const ball of balls){
      if(this !== ball && ball.exists){
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Since physical collision simulation is not the goal, only change the color upon collision.
        if(distance < this.size + ball.size){
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}
```

Now, let's define the user-controlled ball and the EvilCircle that eats the balls. The EvilCircle will inherit from Shape and add a method to eat the balls. Although there will only be one of these, we will use a class for practice. Follow the [example](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features) as directed.

```js
class EvilCircle extends Shape{
  constructor(x, y){
    super(x, y, 20, 20);
    this.color = 'white';
    this.size = 10;
    // Add a keydown event listener to allow user control.
    window.addEventListener('keydown', (e) => {
      switch(e.key){
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
    });
  }

  // Draw the EvilCircle on the canvas object (ctx).
  draw(){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.stroke();
  }

  // Prevent the circle from moving off screen.
  update(){
    // Prevent the ball from moving outside.
    if(this.x + this.size >= width){
      this.x = width - this.size;
    }

    if(this.x - this.size <= 0){
      this.x = this.size;
    }

    if(this.y + this.size >= height){
      this.y = height - this.size;
    }

    if(this.y - this.size <= 0){
      this.y = this.size;
    }
  }

  collisionDetect(){
    for(const ball of balls){
      // Only check existing balls.
      if(ball.exists){
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        // Since physical collision simulation is not the goal, simply mark the ball as non-existent.
        if(distance < this.size + ball.size){
          ball.exists = false;
        }
      }
    }
  }
}
```

Then, create the evilCircle and add it to the loop function.

```js
const evilCircle = new EvilCircle(50, 50);

function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  evilCircle.draw();
  evilCircle.update();
  evilCircle.collisionDetect();

  for(let i = 0; i < balls.length; i++){
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  // Recursively call the loop
  requestAnimationFrame(loop);
}

loop();
```

## 3.2. Displaying the Number of Balls

Finally, let's display the number of balls on the screen. Place a `<p>` tag below the `<h1>` element. Copy the styling from the example.

```html
<h1>Bouncing Balls</h1>
<p>Ball count:</p>
<canvas></canvas>
```

Then, update the content of the `<p>` tag by counting the balls during each call to the loop function.

```js
function loop(){
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  evilCircle.draw();
  evilCircle.update();
  evilCircle.collisionDetect();
  // Update ball count
  let ballCount = 0;

  for(let i = 0; i < balls.length; i++){
    if(balls[i].exists){
      // Count only existing balls.
      ballCount++;
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  para.textContent = `Ball count: ${ballCount}`;
  // Recursively call the loop
  requestAnimationFrame(loop);
}
```

When you run this in a browser, you will see a white circle that the user can control using the keys W, A, S, D, and the number of balls decreases as they are eaten.

# References

Object creation practice: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_building_practice

https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features