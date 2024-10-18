import * as THREE from 'three';

const sizes = {
	width: 800,
	height: 600,
};

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

const scene = new THREE.Scene();
const group = new THREE.Group();

scene.add(group);

const cube1 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);

cube1.position.set(0.7, -0.6, 1);
cube1.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);

group.add(cube1);

const cube2 = new THREE.Mesh(
	new THREE.BoxGeometry(1, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);

group.add(cube2);

cube2.position.set(1, 1, 1);

group.rotation.y = Math.PI / 4;

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

scene.add(camera);

const axisHelper = new THREE.AxesHelper(2);
scene.add(axisHelper);

const renderer = new THREE.WebGLRenderer({
	canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
