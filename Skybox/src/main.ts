import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';

import * as THREE from 'three';

window.addEventListener('load', function () {
	init();
});

async function init() {
	const canvas = document.querySelector('#canvas')!;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		canvas,
	});

	renderer.setSize(window.innerWidth, window.innerHeight);

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		500,
	);

	camera.position.set(0, 0, 0);

	// const controls = new OrbitControls(camera, renderer.domElement);
	// controls.minDistance = 1.5;
	// controls.maxDistance = 100;

	// const loader = new THREE.TextureLoader().setPath('/textures/Yokohama/');
	// const images = [
	// 	'posx.jpg',
	// 	'negx.jpg',
	// 	'posy.jpg',
	// 	'negy.jpg',
	// 	'posz.jpg',
	// 	'negz.jpg',
	// ];

	// THREE.CubeTexture;

	// const geometry = new THREE.BoxGeometry(5000, 5000, 5000);
	// const materials = images.map(
	// 	(image) =>
	// 		new THREE.MeshBasicMaterial({
	// 			map: loader.load(image),
	// 			side: THREE.BackSide,
	// 		}),
	// );

	// const skybox = new THREE.Mesh(geometry, materials);
	// scene.add(skybox);

	// const controls = new OrbitControls(camera, renderer.domElement);
	// controls.minDistance = 1.5;
	// controls.maxDistance = 100;

	// const cubeTextureLoader = new THREE.CubeTextureLoader().setPath(
	// 	'/textures/Yokohama/',
	// );
	// const texture = cubeTextureLoader.load([
	// 	'posx.jpg',
	// 	'negx.jpg',
	// 	'posy.jpg',
	// 	'negy.jpg',
	// 	'posz.jpg',
	// 	'negz.jpg',
	// ]);

	// scene.background = texture;

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.enableZoom = false;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5;
	controls.minDistance = 1.5;
	controls.maxDistance = 100;

	const loader = new THREE.TextureLoader().setPath('/textures/');
	const texture = loader.load('town.jpeg');

	texture.mapping = THREE.EquirectangularRefractionMapping;

	scene.background = texture;

	render();

	function render() {
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	function handleResize() {
		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.render(scene, camera);
	}

	window.addEventListener('resize', handleResize);
}
