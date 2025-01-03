---
title: Brief Summary While Working with ThreeJS
date: "2023-06-15T00:00:00Z"
description: "Overview of ThreeJS official documentation"
tags: ["javascript"]
---

# 1. Introduction

For the basic installation method, refer to the [official documentation's installation guide](https://threejs.org/docs/index.html#manual/en/introduction/Installation). I used Vite for this.

The basic principle is similar to what you learn in graphics. Objects in the Scene are viewed from the Camera, and the Renderer renders the image captured by the camera onto the screen. If the reader is curious about the internal workings, I recommend taking a graphics course. [You can access some older graphics materials in Korean for free from Professor Lim In-Sung's lab at Sogang University.](http://grmanet.sogang.ac.kr/publications.html#book)

In three.js, this is implemented as Scene, Camera, and Renderer. The official page shows an example of displaying a rotating green cube on the screen.

```javascript
// Source: https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
import * as THREE from 'three';
// Scene for the object
const scene = new THREE.Scene();
// Camera to view the object, parameters are field of view, aspect ratio, near, and far.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Renderer to render the object
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the renderer to the DOM tree to display it on the screen.
document.body.appendChild(renderer.domElement);
// Create a box + in green
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// Add the box to the scene
scene.add(cube);

camera.position.z = 5;
// Rendering function
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
```

The Renderer accepts the Scene and Camera, providing a 2D representation of the area illuminated by the camera. Detailed content is covered in graphics courses.

![threejs-cube-nolight](./threejs-1cube-no-light-scene.svg)

If you want to add light, you can include sources like AmbientLight or DirectionalLight and change the Material to MeshPhongMaterial. Phong refers to a model that approximates the lighting based on the creator's name.

```javascript
// Code to create the light
const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
/* Declare DirectionalLight */
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

camera.position.z = 5;
```

# 2. Basic Structure of Three.js

## 2.1. BoxGeometry

Creates a cuboid by accepting width, height, and depth as parameters. The 4th, 5th, and 6th parameters set the number of segments for each face.

```js
const geometry = new THREE.BoxGeometry(width, height, depth);
const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
```

## 2.2. CircleGeometry

Creates a circle by accepting a radius and the number of segments. Segments determine how many arcs will divide the circle. For example, implementing a circle with 8 segments results in a shape closer to an octagon than a perfect circle.

The 3rd and 4th parameters provide the ability to draw arcs by specifying the starting angle and the central angle in radians.

```js
const geometry = new THREE.CircleGeometry(radius, segments);
const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
```

## 2.3. ConeGeometry

Draws a cone. Accepts parameters for radius, height, the number of segments, whether to close the top, the starting angle, and the central angle of the cone.

```js
const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
```

## 2.4. CylinderGeometry

Parameters include top and bottom radius, height, number of segments, whether to close the ends, the starting angle of the cylinder arch, and the central angle.

```js
const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
```

## 2.5. DodecahedronGeometry

Draws a dodecahedron. It requires only the radius and detail level.

```js
// Only radius can be passed
const geometry = new THREE.DodecahedronGeometry(radius);
const geometry = new THREE.DodecahedronGeometry(radius, detail);
```

## 2.6. ExtrudeGeometry

Renders solids created along a path. The solid can be formed through three.js's Shape object.

```js
const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
```

## 2.7. IcosahedronGeometry

Draws an icosahedron.

```js
const geometry = new THREE.IcosahedronGeometry(radius);
const geometry = new THREE.IcosahedronGeometry(radius, detail);
```

## 2.8. SphereGeometry

Draws a sphere. Drawing through spherical coordinates is also supported.

```js
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
```

## 2.9. Other Geometries

- LatheGeometry: Renders shapes created by rotating lines.
- OctahedronGeometry: Draws an octahedron.
- ParametricGeometry: Appears to render solids created through parameters.
- PlaneGeometry: Draws a plane.
- PolyhedronGeometry: Draws a polyhedron.
- RingGeometry: Draws a disk with a hole in the center, resembling a CD.
- ShapeGeometry: Draws a 2D outline.
- TetrahedronGeometry: Draws a tetrahedron.
- TextGeometry: Draws text. Requires loading a separate font.
- TorusGeometry: Draws a torus.
- TorusKnotGeometry: Draws a toroidal knot.
- TubeGeometry: Draws a cylinder along a path.
- EdgesGeometry: Accepts another geometry and only draws edges where the angle between faces exceeds thresholdAngle.
- WireframeGeometry

# 3. Scene Graph

The scene graph represents the hierarchical structure of elements. It deals with the local space of each element and its affiliation. For example, the Earth is part of the Sun's local space, orbiting the Sun, while the Moon orbits the Earth in its local space.

From the Sun's perspective, the Moon traces an unusual path, but the Moon only needs to consider the Earth's local space. To mimic this movement in three.js, you can make the Moon a child of the Earth, allowing it to orbit within the Earth's local space.

Excluding parts similar to the basic setup, the code for creating a hierarchy among object coordinate systems is as follows.

```js
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);

solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const moonOrbit = new THREE.Object3D();
moonOrbit.position.x = 2;
earthOrbit.add(moonOrbit);

const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(.5, .5, .5);
moonOrbit.add(moonMesh);
objects.push(moonMesh);
```

# 4. Material

Material determines how an object appears in the scene. These properties can be set by passing values when calling the material constructor or changed afterward.

- MeshBasicMaterial: Not affected by lighting.
- MeshLambertMaterial: Influenced by lighting, but calculates light only at the vertices.
- MeshPhongMaterial: Calculates lighting at each pixel. Although it's an approximation, it’s used for more accurate light modeling.

Options include shininess, emissive, and others.

For stylistic objects, there’s MeshToonMaterial; for physically-based rendering, there’s MeshStandardMaterial; and MeshPhysicalMaterial offers more advanced physical rendering properties.

Special cases use materials such as ShadowMaterial to capture shadows, MeshDepthMaterial to render pixel depth, and MeshNormalMaterial to render normals. ShaderMaterial allows for custom materials; however, this may not need detailed understanding right now.

## 4.1. Notable Options

- flatShading: Determines if objects are represented angularly; defaults to false.
- side: Determines which side to render; defaults to THREE.FrontSide, but can be THREE.BackSide / THREE.DoubleSide.

Creating materials is resource-intensive, so typically, a material is not changed once created. However, if necessary, set `material.needsUpdate = true`.

# 5. Texture

Textures can be used by creating a `TextureLoader`, then passing an image to the load method, and assigning the returned value to the Material's map property.

```js
const cubes = [];
const loader = new THREE.TextureLoader();

const material = new THREE.MeshBasicMaterial({
  map: loader.load("./witch-new.png"),
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cubes.push(cube);
```

The `loader.load` works asynchronously. As a second argument, you can specify a callback to be called after all textures have been loaded. The following code renders the scene after all textures are loaded.

```js
const loader = new THREE.TextureLoader();
loader.load("./witch-new.png", function (texture) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);
});
```

For loading multiple textures, use `LoadingManager`. Pass an instance of `LoadingManager` as an argument when creating `TextureLoader`. You can also specify a second argument for the load method that defines a callback after all textures are loaded.

Setting a callback to `onProgress` in LoadingManager allows tracking of the current progress.

Be cautious as textures use a significant amount of memory. Typically, textures consume about `width * height * 4 * 1.33` bytes of memory. Therefore, it’s advisable to reduce resolution while maintaining the necessary quality.

Textures rarely match the original size exactly. In such cases, the GPU creates mipmaps, generating maps with progressively smaller sizes and selects the size closest to the geometry for rendering.

Use `texture.magFilter` when the texture is larger than the original, with `THREE.nearestFilter` and `THREE.LinearFilter` available.

For smaller textures, use `texture.minFilter`, which includes `THREE.NearestFilter`, `THREE.LinearFilter`, `THREE.NearestMipmapNearestFilter`, `THREE.NearestMipmapLinearFilter`, `THREE.LinearMipmapNearestFilter`, and `THREE.LinearMipmapLinearFilter`.

Add them as needed.

# 6. Lighting

The primary light types include `AmbientLight`, `DirectionalLight`, and `HemisphereLight`.

## 6.1. AmbientLight

Ambient Light is literally light applied uniformly throughout the scene without a specific direction. It simply multiplies the Light color with the object, lacking direction or emphasis on certain objects.

```js
const light = new THREE.AmbientLight(color, intensity);
```

## 6.2. HemisphereLight

A hemispherical light source. It takes the colors of the ceiling and floor as parameters, blending the colors towards the ceiling and floor accordingly.

```js
const light = new THREE.HemisphereLight(ceilingColor, floorColor, intensity);
```

## 6.3. DirectionalLight

Creates directional light. The constructor accepts the light color and intensity as parameters and requires setting the position and target.

```js
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(x, y, z);
light.target.position.set(x, y, z);
scene.add(light);
```

If the light is not strong enough, it may not appear adequately. For such instances, a `helper` can be used to indicate the light's position. Utilize `DirectionalLightHelper`.

```js
// where light is a DirectionalLight object
const helper = new THREE.DirectionalLightHelper(light);
scene.add(helper);
```

This directional light does not emanate from a single point; it casts light in a specified direction. A point light, which we will see later, is one that emanates from a point.

## 6.4. PointLight

Creates a point light source. The constructor accepts the light color and intensity as parameters and requires setting the position.

```js
const light = new THREE.PointLight(color, intensity);
light.position.set(x, y, z);
```

## 6.5. SpotLight

Creates a spotlight that emits light in a conical shape. Constructor parameters include light color, intensity, position, target, angles, and light range.

```js
const light = new THREE.SpotLight(color, intensity);
// Visual helper for light path
const helper = new THREE.SpotLightHelper(light);
light.position.set(x, y, z);
light.target.position.set(x, y, z);
// Projects a cone-shaped light with a 45-degree inner angle.
light.angle = Math.PI / 4;
// 0 maintains uniform intensity; 1 fades light outward
light.penumbra = 0.05;
```

## 6.6. RectAreaLight

A rectangular light that can only be used with `MeshStandardMaterial` and `MeshPhysicalMaterial`. Constructor parameters include light color and intensity, along with width and height.

```js
const light = new THREE.RectAreaLight(color, intensity, width, height);
```

Setting `renderer.physicallyCorrectLights` to true enables physical light correction. We will pass over this for now.

![Types of Light](./light-types.png)

# 7. Camera

You can create a `PerspectiveCamera` as follows.

```js
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

Setting near and far is crucial. If near is set too small and far too large, all objects will be visible, but this affects the camera's precision.

Precision varies within the range between near and far, with closer objects having higher precision and farther ones lower. This condition can lead to a phenomenon known as z-fighting, where objects appear broken. Setting `logarithmicDepthBuffer` to true when creating `WebGLRenderer` can alleviate this issue, though it's only supported on some devices...

Thus, near and far should be set with caution.

## 7.1. OrthographicCamera

This represents an orthographic camera. Instead of the truncated pyramid shape of a perspective camera, it uses a rectangular prism shape. The constructor accepts left, right, top, bottom, near, and far as parameters.

```js
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
```

This camera creates a parallelepiped based on the six parameters received, projecting objects within that space orthographically, ensuring that object sizes remain consistent regardless of distance from the camera.

# 8. Shadows

Three.js uses shadow maps to create shadows, which involves rendering all objects that cast shadows from the light's perspective. Therefore, each shadow-casting object is rendered once for each light source.

For example, if there are 20 objects and 5 lights, and all 20 can cast shadows, the scene will render six times (once for objects, five for shadows).

Instead of creating multiple lights that cast shadows, it is generally more common to use one light for casting shadows or to create fake shadows. However, we will delve into this later. To use shadows, enable the `shadowMap` option of the renderer and configure the light to cast shadows.

```js
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
/* Enable the renderer to draw shadows */
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

/* Camera setup */
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 10, 20);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

scene.background = new THREE.Color('black');

/* Draw the floor */
const planeSize = 40;
const texture = new THREE.TextureLoader().load('./witch-new.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(planeGeo, planeMat);
/* The floor does not cast shadows but is affected by them. */
mesh.receiveShadow = true;
mesh.rotation.x = Math.PI * -0.5;
scene.add(mesh);
/* Draw the cube */
const cubeSize = 4;
const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' });
const mesh2 = new THREE.Mesh(cubeGeo, cubeMat);
/* Make the cube cast shadows */
mesh2.castShadow = true;
/* Make the cube receive shadows */
mesh2.receiveShadow = true;
mesh2.position.set(cubeSize + 1, cubeSize / 2, 0);
scene.add(mesh2);

/* Create light */
const lightColor = 0xFFFFFF;
const lightIntensity = 1;
const light = new THREE.DirectionalLight(lightColor, lightIntensity);
/* Make the light cast shadows */
light.castShadow = true;
light.position.set(0, 10, 0);
light.target.position.set(-4, 0, -4);
scene.add(light);
scene.add(light.target);
```

This setup may result in some shadows appearing clipped, as only shadows within the shadow camera's range will be rendered. The shadow camera exists at the light's position and looks at the target, rendering only shadows within a specific space. Shadows outside this space may be clipped.

# Other

Rendering fog: https://threejs.org/manual/#ko/fog\
Creating custom geometry: https://threejs.org/manual/#ko/custom-buffergeometry

# References

https://threejs.org/manual/#en/fundamentals

https://threejs.org/manual/#ko/fundamentals