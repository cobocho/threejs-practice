import * as THREE from 'three';

const sizes = {
	width: 800,
	height: 600,
};

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
	canvas,
});

let time = Date.now();

const FPS = 60;
const FRAME = 1000 / FPS;

const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	console.log(elapsedTime);

	cube.rotation.y = elapsedTime * Math.PI * 2;

	renderer.render(scene, camera);

	window.requestAnimationFrame(tick);
};

tick();

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
