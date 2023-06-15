---
title: ThreeJS를 하면서 간략한 정리
date: "2023-06-15T00:00:00Z"
description: "ThreeJS 공식 문서 훑어보기"
tags: ["threejs", "javascript"]
---

# 1. 시작

기본적인 설치법은 [공식 문서의 설치 가이드](https://threejs.org/docs/index.html#manual/en/introduction/Installation)를 참고. 나는 이곳에서 Vite를 사용했다.

기본 원리는 그래픽스에서 배운 것과 같다. Scene에 있는 물체를 Camera에서 보고, 카메라에 맺힌 영상을 Renderer가 화면에 렌더링한다.

three.js에서는 이를 각각 Scene, Camera, Renderer로 구현한다. 공식 페이지에서는 화면에 회전하는 초록색 정육면체를 띄우는 예제를 보여준다.

```javascript
// 출처 : https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
import * as THREE from 'three';
// 물체가 들어갈 scene
const scene = new THREE.Scene();
// 물체를 비출 카메라. 인수는 시야각, aspect ratio, near, far이다.
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 물체를 렌더링할 렌더러
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// DOM tree에 렌더러를 추가해서 화면에 띄운다.
document.body.appendChild( renderer.domElement );
// 박스 만들기 + 초록색으로
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene에 박스 추가
scene.add( cube );

camera.position.z = 5;
// 렌더링 함수
function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();
```

Renderer는 Scene, Camera를 넘겨받아서 카메라가 비추고 있는 범위를 2차원으로 축소해서 제공한다. 자세한 내용은 그래픽스 과목에서 다룬다.

![threejs-cube-nolight](./threejs-1cube-no-light-scene.svg)

만약 빛을 넣고 싶다면 AmbientLight나 DirectionalLight 등의 광원을 추가하고 Material을 MeshPhongMaterial로 바꾸면 된다. Phong은 광원을 근사적으로 모델링하는 모델 이름인데 제작자 이름을 따서 만들어졌다.

```javascript
// 빛 만들기 코드의 일부
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
/* DirectionalLight 선언 */
const color=0xFFFFFF;
const intensity=1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

camera.position.z = 5;
```

# 2. threejs 기본 구조

## 2.1. BoxGeometry

너비, 높이, 깊이를 인자로 받아서 육면체를 만든다. 그리고 4,5,6번째 인수로 각 면을 이루는 세그먼트 개수에 대한 설정을 할 수 있다.

```js
const geometry = new THREE.BoxGeometry(width, height, depth);
const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
```

## 2.2. CircleGeometry

반지름과 세그먼트 개수를 받아서 원을 만든다. 세그먼트는 원을 몇 개의 호로 나눌지를 결정한다. 예를 들어서 8개의 세그먼트로 원을 구현한다면 원보다는 팔각형에 가까운 모양이 렌더링된다.

3,4번째 인수로는 호를 그릴 수 있는 기능을 제공하는데 호의 시작 각도와 호의 중심각을 지정할 수 있다. 라디안 단위.

```js
const geometry = new THREE.CircleGeometry(radius, segments);
const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
```

## 2.3. ConeGeometry

원뿔 그리기. 반지름, 높이, 세그먼트 개수, 원뿔의 꼭대기를 닫을지 여부, 원뿔호의 시작각도, 원뿔호의 중심각도를 인수로 받는다.

```js
const geometry = new THREE.ConeGeometry( radius, height, radialSegments );
const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );
```

## 2.4. CylinderGeometry

윗/밑면 반지름, 높이, 세그먼트 개수, 끝을 닫을지 여부, 원기둥 호의 시작각도, 호의 중심각. 

```js
const geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments );
const geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength );
```

## 2.5. DodecahedronGeometry

십이면체를 그린다. 반지름과 디테일한 정도가 전부다.

```js
// 반지름만 전달도 가능
const geometry = new THREE.DodecahedronGeometry( radius );
const geometry = new THREE.DodecahedronGeometry( radius, detail );
```

## 2.6. ExtrudeGeometry

경로를 따라 생성된 입체를 렌더링한다. 입체는 threejs의 Shape 객체를 통해 만들어질 수 있다.

```js
const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
```

## 2.7. IcosahedronGeometry

이십면체를 그린다.

```js
const geometry = new THREE.IcosahedronGeometry( radius );
const geometry = new THREE.IcosahedronGeometry( radius, detail );
```

## 2.8. SphereGeometry

구를 그린다. 구면 좌표계를 통한 그림도 지원한다.

```js
const geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
```

## 2.8. 기타 Geometry

- LatheGeometry : 선을 회전시켜 만든 모양을 렌더링한다.
- OctahedronGeometry : 팔면체를 그린다.
- ParametricGeometry : 매개 변수를 통해서 만든 입체를 렌더링하는 듯 하다.
- PlaneGeometry : 평면을 그린다.
- PolyhedronGeometry : 다면체를 그린다.
- RingGeometry : 중앙이 비어 있는 CD같은 모양의 디스크를 그린다.
- ShapeGeometry : 2D 윤곽선을 그린다.
- TetrahedronGeometry : 사면체를 그린다.
- TextGeometry : 텍스트를 그린다. 폰트를 따로 로딩해 줘야 한다.
- TorusGeometry : 도넛 모양을 그린다.
- TorusKnotGeometry : 원환 매듭 모양을 그린다.
- TubeGeometry : 경로를 따라서 원통을 그린다.
- EdgesGeometry : 다른 geometry를 받아서 각 면 사이 각이 thresholdAngle 이상일 때만 모서리를 그린다. 
- WireframeGeometry

# 3. Scene graph

씬 그래프는 요소의 계층 구조를 나타낸다. 각 요소의 지역 공간과 그 소속을 다루는 것이다. 예를 들어서 지구는 태양의 지역 공간에 속해서 태양을 공전한다. 그리고 달은 지구의 지역 공간에서 공전한다. 

태양의 입장에서 보면 달은 괴상한 모양을 그리겠지만 달은 그냥 지구의 지역 공간만 신경쓰면 된다. threejs에서 이런 움직임을 모방하려 한다면 달을 지구의 자식으로 만들어서 지구의 지역 공간에서 공전하게 만들면 될 뿐이다.



# 참고

https://threejs.org/manual/#en/fundamentals

https://threejs.org/manual/#ko/fundamentals