import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';

import * as THREE from 'three';
import { Firework } from './Firework';

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
		10000,
	);

	camera.rotation.z = Math.PI / 3;
	camera.position.set(0, 0, 8000);
	new OrbitControls(camera, renderer.domElement);

	const fireworks: Firework[] = [];

	render();

	function render() {
		renderer.render(scene, camera);

		fireworks.forEach((firework) => {
			firework.update();
		});

		requestAnimationFrame(render);
	}

	function handleResize() {
		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.render(scene, camera);
	}

	window.addEventListener('click', () => {
		const firework = new Firework({
			x: THREE.MathUtils.randFloatSpread(8000),
			y: THREE.MathUtils.randFloatSpread(8000),
		});
		fireworks.push(firework);
		scene.add(firework.points);
	});

	window.addEventListener('resize', handleResize);
}
